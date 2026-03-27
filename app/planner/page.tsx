import { getAllPlants, getAllCalendarEntries } from "@/lib/supabase";
import { getPlantImageUrl } from "@/lib/wikipedia";
import PlannerClient from "./PlannerClient";
import type { Plant } from "@/types";

export const revalidate = 3600;

export default async function PlannerPage() {
  const [plants, calendar] = await Promise.all([
    getAllPlants(),
    getAllCalendarEntries(),
  ]);

  // Give every plant a proxy image URL
  const enriched: Plant[] = plants.map((plant) => ({
    ...plant,
    image_url: getPlantImageUrl(plant.name_latin, plant.name_en),
  }));

  return <PlannerClient allPlants={enriched} allCalendar={calendar} />;
}
