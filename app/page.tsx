import { getAllPlants } from "@/lib/supabase";
import PlantGrid from "@/components/PlantGrid";

export const revalidate = 3600; // re-fetch from Supabase at most once per hour

export default async function HomePage() {
  const plants = await getAllPlants();

  return (
    <div>
      {/* Hero */}
      <section className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-garden-green mb-3">
          What's growing in your Belgian garden?
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-lg">
          Browse vegetables, fruits, herbs and flowers suited to the Belgian climate.
          Find out when to plant, when to harvest, and what grows well together.
        </p>
      </section>

      {/* Quick links */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <a href="/planner" className="btn-primary flex items-center gap-2">
          📅 Monthly Planner
        </a>
        <a href="#plants" className="btn-outline flex items-center gap-2">
          🌿 Browse All Plants
        </a>
      </div>

      {/* Plant grid with filters */}
      <section id="plants">
        <PlantGrid plants={plants} />
      </section>
    </div>
  );
}
