import { getAllPlants } from "@/lib/supabase";
import { fetchWikipediaImage } from "@/lib/wikipedia";
import PlantGrid from "@/components/PlantGrid";
import type { Plant } from "@/types";

export const revalidate = 3600;

export default async function BrowsePage() {
  const plants = await getAllPlants();

  // Enrich plants with Wikipedia images where no image_url is set
  const enriched: Plant[] = await Promise.all(
    plants.map(async (plant) => {
      if (plant.image_url) return plant;
      const wikiImage = await fetchWikipediaImage(plant.name_latin, plant.name_en);
      return wikiImage ? { ...plant, image_url: wikiImage } : plant;
    })
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-garden-green mb-2">Browse All Plants</h1>
        <p className="text-gray-500">
          {plants.length} plants suited to the Belgian climate — vegetables, fruits, herbs, and flowers.
        </p>
      </div>
      <PlantGrid plants={enriched} />
    </div>
  );
}
