import { getAllPlants, getAllCalendarEntries } from "@/lib/supabase";
import { fetchWikipediaImage } from "@/lib/wikipedia";
import PlannerClient from "./PlannerClient";
import type { Plant } from "@/types";

export const revalidate = 3600;

export default async function PlannerPage() {
  const [plants, calendar] = await Promise.all([
    getAllPlants(),
    getAllCalendarEntries(),
  ]);

  // Enrich with Wikipedia images where no stored image exists
  const enriched: Plant[] = await Promise.all(
    plants.map(async (plant) => {
      if (plant.image_url) return plant;
      const wikiImage = await fetchWikipediaImage(plant.name_latin, plant.name_en);
      return wikiImage ? { ...plant, image_url: wikiImage } : plant;
    })
  );

  return <PlannerClient allPlants={enriched} allCalendar={calendar} />;
}
