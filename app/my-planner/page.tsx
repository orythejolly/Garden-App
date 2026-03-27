import { getAllPlants, getAllCalendarEntries, getAllCompanionsRaw } from "@/lib/supabase";
import { getPlantImageUrl } from "@/lib/wikipedia";
import MyPlannerClient from "./MyPlannerClient";
import type { Plant } from "@/types";

export const revalidate = 3600;

export default async function MyPlannerPage() {
  const [plants, calendar, companions] = await Promise.all([
    getAllPlants(),
    getAllCalendarEntries(),
    getAllCompanionsRaw(),
  ]);

  // Give every plant a proxy image URL
  const enriched: Plant[] = plants.map((plant) => ({
    ...plant,
    image_url: getPlantImageUrl(plant.name_latin, plant.name_en),
  }));

  return (
    <MyPlannerClient
      allPlants={enriched}
      allCalendar={calendar}
      allCompanions={companions}
    />
  );
}
