import { createClient } from "@supabase/supabase-js";
import type { Plant, CalendarEntry, Companion } from "@/types";

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ── Plants ────────────────────────────────────────────────────

export async function getAllPlants(): Promise<Plant[]> {
  const { data, error } = await supabase
    .from("plants")
    .select("*")
    .order("name_en");
  if (error) throw error;
  return data ?? [];
}

export async function getPlantBySlug(slug: string): Promise<Plant | null> {
  const { data, error } = await supabase
    .from("plants")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data;
}

export async function getPlantsByType(type: string): Promise<Plant[]> {
  const { data, error } = await supabase
    .from("plants")
    .select("*")
    .eq("type", type)
    .order("name_en");
  if (error) throw error;
  return data ?? [];
}

// ── Calendar ──────────────────────────────────────────────────

export async function getCalendarForPlant(plantId: string): Promise<CalendarEntry[]> {
  const { data, error } = await supabase
    .from("planting_calendar")
    .select("*")
    .eq("plant_id", plantId)
    .order("month_start");
  if (error) throw error;
  return data ?? [];
}

/**
 * Returns all plants that have at least one calendar activity
 * overlapping with the given month (1–12).
 */
export async function getPlantsByMonth(month: number): Promise<Plant[]> {
  // We fetch all calendar entries where the month falls inside [month_start, month_end]
  // Note: some entries wrap around year-end (e.g. Oct→Mar), handled in JS
  const { data: entries, error } = await supabase
    .from("planting_calendar")
    .select("plant_id, month_start, month_end, activity");
  if (error) throw error;

  const matchingIds = new Set<string>();
  for (const e of entries ?? []) {
    if (monthInRange(month, e.month_start, e.month_end)) {
      matchingIds.add(e.plant_id);
    }
  }

  if (matchingIds.size === 0) return [];

  const { data: plants, error: pErr } = await supabase
    .from("plants")
    .select("*")
    .in("id", [...matchingIds])
    .order("name_en");
  if (pErr) throw pErr;
  return plants ?? [];
}

/** Returns the activities for a given plant in a given month */
export async function getActivitiesForPlantInMonth(
  plantId: string,
  month: number
): Promise<CalendarEntry[]> {
  const all = await getCalendarForPlant(plantId);
  return all.filter((e) => monthInRange(month, e.month_start, e.month_end));
}

function monthInRange(month: number, start: number, end: number): boolean {
  if (start <= end) return month >= start && month <= end;
  // Wraps over year boundary (e.g. Oct=10 → Mar=3)
  return month >= start || month <= end;
}

// ── Companions ────────────────────────────────────────────────

export async function getCompanionsForPlant(plantId: string): Promise<Companion[]> {
  // Query both directions: A→B and B→A
  const [{ data: aToB }, { data: bToA }] = await Promise.all([
    supabase
      .from("companions")
      .select("*, companion:companion_id(*)")
      .eq("plant_id", plantId),
    supabase
      .from("companions")
      .select("*, companion:plant_id(*)")
      .eq("companion_id", plantId),
  ]);

  const results = [...(aToB ?? []), ...(bToA ?? [])];
  // Deduplicate by companion id
  const seen = new Set<string>();
  return results.filter((c) => {
    const key = c.companion?.id ?? c.companion_id ?? c.plant_id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
