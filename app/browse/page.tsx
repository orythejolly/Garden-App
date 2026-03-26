import { getAllPlants } from "@/lib/supabase";
import { getPlantImageUrl } from "@/lib/wikipedia";
import BrowseClient from "./BrowseClient";
import type { Plant } from "@/types";

export const revalidate = 3600;

export default async function BrowsePage() {
  const plants = await getAllPlants();

  // Give every plant a proxy image URL (served through our API, never direct Wikimedia)
  const enriched: Plant[] = plants.map((plant) => ({
    ...plant,
    image_url: getPlantImageUrl(plant.name_latin, plant.name_en),
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-garden-green mb-2">Browse All Plants</h1>
        <p className="text-gray-500">
          {plants.length} plants suited to the Belgian climate — vegetables, fruits, herbs, and flowers.
        </p>
      </div>
      <BrowseClient plants={enriched} />
    </div>
  );
}
