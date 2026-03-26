"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Plant, PlantType } from "@/types";
import { TYPE_LABELS, TYPE_EMOJI } from "@/types";

const FILTERS: { label: string; value: PlantType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "🥦 Vegetables", value: "vegetable" },
  { label: "🍓 Fruits", value: "fruit" },
  { label: "🌿 Herbs", value: "herb" },
  { label: "🌸 Flowers", value: "flower" },
  { label: "🌶️ Spices", value: "spice" },
];

const DIFFICULTY_COLOUR: Record<string, string> = {
  easy:   "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard:   "bg-red-100 text-red-700",
};

export default function PlantGrid({ plants }: { plants: Plant[] }) {
  const [activeType, setActiveType]   = useState<PlantType | "all">("all");
  const [search, setSearch]           = useState("");
  const [locationFilter, setLocation] = useState<"all" | "outdoor" | "greenhouse">("all");

  const filtered = plants.filter((p) => {
    if (activeType !== "all" && p.type !== activeType) return false;
    if (search && !p.name_en.toLowerCase().includes(search.toLowerCase())) return false;
    if (locationFilter === "outdoor"    && !p.outdoor)    return false;
    if (locationFilter === "greenhouse" && !p.greenhouse) return false;
    return true;
  });

  return (
    <div>
      {/* Search */}
      <div className="mb-5">
        <input
          type="search"
          placeholder="Search plants…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-garden-green"
        />
      </div>

      {/* Type filter pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveType(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeType === f.value
                ? "bg-garden-green text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-garden-green"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Location filter */}
      <div className="flex gap-2 mb-6 text-sm">
        {(["all", "outdoor", "greenhouse"] as const).map((loc) => (
          <button
            key={loc}
            onClick={() => setLocation(loc)}
            className={`px-3 py-1 rounded-lg transition-colors ${
              locationFilter === loc
                ? "bg-garden-earth text-white"
                : "bg-white border border-gray-200 text-gray-500 hover:border-garden-earth"
            }`}
          >
            {loc === "all" ? "🏡 All locations" : loc === "outdoor" ? "☀️ Outdoor" : "🏚️ Greenhouse"}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-400 mb-4">{filtered.length} plant{filtered.length !== 1 ? "s" : ""}</p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🌱</p>
          <p>No plants found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      )}
    </div>
  );
}

function PlantCard({ plant }: { plant: Plant }) {
  return (
    <Link href={`/plants/${plant.slug}`} className="card group flex flex-col">
      {/* Image */}
      <div className="relative h-36 bg-garden-light/30">
        {plant.image_url ? (
          <Image
            src={plant.image_url}
            alt={plant.name_en}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            {TYPE_EMOJI[plant.type]}
          </div>
        )}
        {/* Type badge */}
        <span className="absolute top-2 left-2 badge bg-white/90 text-gray-600 shadow-sm">
          {TYPE_EMOJI[plant.type]} {TYPE_LABELS[plant.type]}
        </span>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1">
        <h3 className="font-semibold text-gray-800 text-sm leading-tight">{plant.name_en}</h3>
        {plant.name_latin && (
          <p className="text-xs text-gray-400 italic truncate">{plant.name_latin}</p>
        )}
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          <span className={`badge ${DIFFICULTY_COLOUR[plant.difficulty]}`}>
            {plant.difficulty}
          </span>
          {plant.greenhouse && (
            <span className="badge bg-purple-50 text-purple-700">🏚️ greenhouse</span>
          )}
        </div>
      </div>
    </Link>
  );
}
