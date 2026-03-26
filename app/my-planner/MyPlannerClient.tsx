"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Plant, CalendarEntry, PlantType } from "@/types";
import type { CompanionRaw } from "@/lib/supabase";
import { MONTHS, ACTIVITY_COLOURS, TYPE_EMOJI, TYPE_LABELS } from "@/types";

// ── Types ────────────────────────────────────────────────────────────────────

type Activity = "sow_indoor" | "transplant" | "sow_outdoor" | "harvest";

const ACTIVITY_PRIORITY: Activity[] = ["harvest", "sow_outdoor", "transplant", "sow_indoor"];

const ACTIVITY_BAR: Record<Activity, string> = {
  harvest:     "bg-orange-300",
  sow_outdoor: "bg-green-300",
  transplant:  "bg-yellow-300",
  sow_indoor:  "bg-blue-300",
};

const TYPE_BG: Record<PlantType | "spice", string> = {
  vegetable: "bg-green-50",
  fruit:     "bg-red-50",
  herb:      "bg-emerald-50",
  flower:    "bg-pink-50",
  spice:     "bg-orange-50",
};

const FILTERS: { label: string; value: PlantType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "🥦 Veg", value: "vegetable" },
  { label: "🍓 Fruit", value: "fruit" },
  { label: "🌿 Herb", value: "herb" },
  { label: "🌸 Flower", value: "flower" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function monthInRange(month: number, start: number, end: number): boolean {
  if (start <= end) return month >= start && month <= end;
  return month >= start || month <= end;
}

function getBestActivity(
  calendar: CalendarEntry[],
  plantId: string,
  month: number
): Activity | null {
  const entries = calendar.filter(
    (e) => e.plant_id === plantId && monthInRange(month, e.month_start, e.month_end)
  );
  for (const act of ACTIVITY_PRIORITY) {
    if (entries.some((e) => e.activity === act)) return act;
  }
  return null;
}

// ── Props ────────────────────────────────────────────────────────────────────

interface Props {
  allPlants: Plant[];
  allCalendar: CalendarEntry[];
  allCompanions: CompanionRaw[];
}

// ── Component ────────────────────────────────────────────────────────────────

export default function MyPlannerClient({ allPlants, allCalendar, allCompanions }: Props) {
  const [myPlan, setMyPlan] = useState<Plant[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<PlantType | "all">("all");

  // ── Derived: plant picker ─────────────────────────────────────────────────
  const planIds = useMemo(() => new Set(myPlan.map((p) => p.id)), [myPlan]);

  const filteredPlants = useMemo(() =>
    allPlants.filter((p) => {
      if (typeFilter !== "all" && p.type !== typeFilter) return false;
      if (search && !p.name_en.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }),
    [allPlants, typeFilter, search]
  );

  // ── Derived: plan data ────────────────────────────────────────────────────
  const planCalendar = useMemo(
    () => allCalendar.filter((e) => planIds.has(e.plant_id)),
    [allCalendar, planIds]
  );

  const planCompanions = useMemo(() => {
    if (myPlan.length < 2) return [];
    return allCompanions.filter(
      (c) => planIds.has(c.plant_id) && planIds.has(c.companion_id)
    );
  }, [allCompanions, planIds, myPlan.length]);

  const plantById = useMemo(() => {
    const map = new Map<string, Plant>();
    allPlants.forEach((p) => map.set(p.id, p));
    return map;
  }, [allPlants]);

  const beneficial = planCompanions.filter((c) => c.relationship === "beneficial");
  const harmful    = planCompanions.filter((c) => c.relationship === "harmful");

  // ── Actions ───────────────────────────────────────────────────────────────
  function addPlant(plant: Plant) {
    if (!planIds.has(plant.id)) setMyPlan((prev) => [...prev, plant]);
  }

  function removePlant(id: string) {
    setMyPlan((prev) => prev.filter((p) => p.id !== id));
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-garden-green mb-2">📋 My Garden Plan</h1>
        <p className="text-gray-500">
          Add plants to build your personalised plan. See their full-year calendar and companion compatibility.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ── Left: Plant Picker ── */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Add plants</h2>

          {/* Search */}
          <input
            type="search"
            placeholder="Search plants…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-garden-green"
          />

          {/* Type filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setTypeFilter(f.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  typeFilter === f.value
                    ? "bg-garden-green text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-garden-green"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Plant list */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredPlants.length === 0 && (
              <p className="text-sm text-gray-400 py-4 text-center">No plants found.</p>
            )}
            {filteredPlants.map((plant) => {
              const inPlan = planIds.has(plant.id);
              return (
                <div
                  key={plant.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    inPlan
                      ? "bg-garden-light/30 border-garden-green"
                      : "bg-white border-gray-200 hover:border-garden-green"
                  }`}
                  onClick={() => inPlan ? removePlant(plant.id) : addPlant(plant)}
                >
                  <span className="text-xl shrink-0">{TYPE_EMOJI[plant.type]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{plant.name_en}</p>
                    {plant.name_latin && (
                      <p className="text-xs text-gray-400 italic truncate">{plant.name_latin}</p>
                    )}
                  </div>
                  <button
                    className={`shrink-0 w-7 h-7 rounded-full text-sm font-bold flex items-center justify-center transition-colors ${
                      inPlan
                        ? "bg-garden-green text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-garden-green hover:text-white"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      inPlan ? removePlant(plant.id) : addPlant(plant);
                    }}
                  >
                    {inPlan ? "✓" : "+"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right: My Plan ── */}
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            My plan{" "}
            {myPlan.length > 0 && (
              <span className="text-sm text-gray-400 font-normal">
                ({myPlan.length} plant{myPlan.length !== 1 ? "s" : ""})
              </span>
            )}
          </h2>

          {myPlan.length === 0 ? (
            <div className="card p-8 text-center text-gray-400">
              <div className="text-4xl mb-3">🪴</div>
              <p className="text-sm">Add plants from the left to build your plan.</p>
            </div>
          ) : (
            <div className="space-y-5">

              {/* Selected plants chips */}
              <div className="flex flex-wrap gap-2">
                {myPlan.map((plant) => (
                  <span
                    key={plant.id}
                    className="flex items-center gap-1.5 bg-garden-light/50 border border-garden-green text-garden-green text-sm font-medium px-3 py-1 rounded-full"
                  >
                    {TYPE_EMOJI[plant.type]} {plant.name_en}
                    <button
                      onClick={() => removePlant(plant.id)}
                      className="ml-1 text-garden-green hover:text-red-500 transition-colors text-xs leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* ── Calendar Preview ── */}
              <div className="card p-4">
                <h3 className="font-semibold text-garden-green text-sm mb-3">📅 Year Calendar</h3>

                {/* Month headers */}
                <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                  <div />
                  <div className="grid grid-cols-12 gap-0.5 mb-1">
                    {MONTHS.map((m) => (
                      <div key={m} className="text-center text-[9px] text-gray-400 font-medium">{m}</div>
                    ))}
                  </div>

                  {myPlan.map((plant) => (
                    <>
                      <div
                        key={`label-${plant.id}`}
                        className="text-xs text-gray-600 font-medium truncate max-w-[80px] self-center"
                        title={plant.name_en}
                      >
                        {plant.name_en.split(" ")[0]}
                      </div>
                      <div key={`bar-${plant.id}`} className="grid grid-cols-12 gap-0.5">
                        {Array.from({ length: 12 }, (_, i) => {
                          const month = i + 1;
                          const act = getBestActivity(planCalendar, plant.id, month);
                          return (
                            <div
                              key={month}
                              title={act ? `${plant.name_en}: ${act.replace("_", " ")} in ${MONTHS[i]}` : undefined}
                              className={`h-5 rounded-sm ${act ? ACTIVITY_BAR[act] : "bg-gray-100"}`}
                            />
                          );
                        })}
                      </div>
                    </>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-300 inline-block" /> Sow indoors</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-300 inline-block" /> Transplant</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-300 inline-block" /> Sow outdoors</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-300 inline-block" /> Harvest</span>
                </div>
              </div>

              {/* ── Companion Planting ── */}
              {planCompanions.length > 0 && (
                <div className="card p-4">
                  <h3 className="font-semibold text-garden-green text-sm mb-3">🤝 Companion Planting</h3>

                  {beneficial.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-green-700 mb-1.5">✅ Good neighbours in your plan</p>
                      <div className="space-y-1.5">
                        {beneficial.map((c) => {
                          const a = plantById.get(c.plant_id);
                          const b = plantById.get(c.companion_id);
                          if (!a || !b) return null;
                          return (
                            <div key={c.id} className="flex items-start gap-2 bg-green-50 rounded-lg p-2 text-xs">
                              <span className="shrink-0">{TYPE_EMOJI[a.type]} {a.name_en} + {TYPE_EMOJI[b.type]} {b.name_en}</span>
                              {c.reason && <span className="text-gray-500 italic">— {c.reason}</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {harmful.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-red-700 mb-1.5">⛔ Avoid planting together</p>
                      <div className="space-y-1.5">
                        {harmful.map((c) => {
                          const a = plantById.get(c.plant_id);
                          const b = plantById.get(c.companion_id);
                          if (!a || !b) return null;
                          return (
                            <div key={c.id} className="flex items-start gap-2 bg-red-50 rounded-lg p-2 text-xs">
                              <span className="shrink-0">{TYPE_EMOJI[a.type]} {a.name_en} + {TYPE_EMOJI[b.type]} {b.name_en}</span>
                              {c.reason && <span className="text-gray-500 italic">— {c.reason}</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Clear plan */}
              <button
                onClick={() => setMyPlan([])}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                Clear plan
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tip */}
      <div className="mt-8 text-xs text-gray-400 text-center">
        💡 Click any plant card to view its full profile including detailed companion planting info &nbsp;·&nbsp;
        <Link href="/browse" className="underline">Browse all plants</Link>
      </div>
    </div>
  );
}
