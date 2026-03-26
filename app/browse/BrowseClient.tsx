"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Plant, PlantType } from "@/types";
import { TYPE_LABELS, TYPE_EMOJI } from "@/types";

const STORAGE_KEY = "chichi-garden-plan";

const FILTERS: { label: string; value: PlantType | "all" }[] = [
  { label: "All",           value: "all"       },
  { label: "🥦 Vegetables", value: "vegetable" },
  { label: "🍓 Fruits",     value: "fruit"     },
  { label: "🌿 Herbs",      value: "herb"      },
  { label: "🌸 Flowers",    value: "flower"    },
  { label: "🌶️ Spices",    value: "spice"     },
];

const DIFFICULTY_COLOUR: Record<string, string> = {
  easy:   "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  hard:   "bg-red-100 text-red-700",
};

export default function BrowseClient({ plants }: { plants: Plant[] }) {
  const [activeType, setActiveType]   = useState<PlantType | "all">("all");
  const [search, setSearch]           = useState("");
  const [locationFilter, setLocation] = useState<"all" | "outdoor" | "greenhouse">("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // ── Sync with shared localStorage key ──────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setSelectedIds(new Set(JSON.parse(saved) as string[]));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...selectedIds]));
    } catch {}
  }, [selectedIds]);

  function togglePlant(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  const filtered = plants.filter((p) => {
    if (activeType !== "all" && p.type !== activeType) return false;
    if (search && !p.name_en.toLowerCase().includes(search.toLowerCase())) return false;
    if (locationFilter === "outdoor"    && !p.outdoor)    return false;
    if (locationFilter === "greenhouse" && !p.greenhouse) return false;
    return true;
  });

  const myPlan = plants.filter((p) => selectedIds.has(p.id));

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* ── Left: plant grid ─────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
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
        <p className="text-sm text-gray-400 mb-4">
          {filtered.length} plant{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🌱</p>
            <p>No plants found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filtered.map((plant) => (
              <PlantCard
                key={plant.id}
                plant={plant}
                inPlan={selectedIds.has(plant.id)}
                onToggle={() => togglePlant(plant.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Right: My Plan sidebar ───────────────────────────────────────── */}
      <div className="w-full lg:w-72 shrink-0">
        <div className="sticky top-6">
          <div className="card p-5">
            <h2 className="text-lg font-semibold text-garden-green mb-0.5">🗒️ My Plan</h2>
            <p className="text-xs text-gray-400 mb-4">
              Click <span className="font-medium text-garden-green">+</span> on any plant to add it.{" "}
              <Link href="/my-planner" className="underline hover:text-garden-green">
                View full planner →
              </Link>
            </p>

            {myPlan.length === 0 ? (
              <div className="py-10 text-center text-gray-300">
                <p className="text-3xl mb-2">🪴</p>
                <p className="text-sm">No plants selected yet</p>
              </div>
            ) : (
              <ul className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                {myPlan.map((plant) => (
                  <li
                    key={plant.id}
                    className="flex items-center gap-3 p-2 bg-garden-cream rounded-xl"
                  >
                    <span className="text-xl shrink-0">{TYPE_EMOJI[plant.type]}</span>
                    <Link
                      href={`/plants/${plant.slug}`}
                      className="flex-1 min-w-0 text-sm font-medium text-gray-800 hover:text-garden-green truncate"
                    >
                      {plant.name_en}
                    </Link>
                    <button
                      onClick={() => togglePlant(plant.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none shrink-0"
                      title="Remove"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {myPlan.length > 0 && (
              <button
                onClick={() => setSelectedIds(new Set())}
                className="mt-4 w-full text-xs text-gray-400 hover:text-red-400 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          <p className="text-xs text-gray-400 text-center mt-3">
            Your plan also appears in{" "}
            <Link href="/planner" className="underline hover:text-garden-green">Monthly View</Link>
            {" & "}
            <Link href="/my-planner" className="underline hover:text-garden-green">My Planner</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function PlantCard({
  plant,
  inPlan,
  onToggle,
}: {
  plant: Plant;
  inPlan: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`card group flex flex-col relative transition-all ${inPlan ? "ring-2 ring-garden-green ring-offset-1 shadow-md" : ""}`}>
      {/* Image — links to plant detail */}
      <Link href={`/plants/${plant.slug}`} className="block relative h-36 bg-garden-light/30">
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
      </Link>

      {/* Info + add button */}
      <div className="p-3 flex flex-col gap-1">
        <Link href={`/plants/${plant.slug}`} className="hover:text-garden-green">
          <h3 className="font-semibold text-gray-800 text-sm leading-tight">{plant.name_en}</h3>
          {plant.name_latin && (
            <p className="text-xs text-gray-400 italic truncate">{plant.name_latin}</p>
          )}
        </Link>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`badge ${DIFFICULTY_COLOUR[plant.difficulty]}`}>
              {plant.difficulty}
            </span>
            {plant.greenhouse && (
              <span className="badge bg-purple-50 text-purple-700">🏚️ greenhouse</span>
            )}
          </div>
          {/* Add / remove plan button */}
          <button
            onClick={onToggle}
            title={inPlan ? "Remove from plan" : "Add to plan"}
            className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-sm shrink-0 ${
              inPlan
                ? "bg-garden-green text-white hover:bg-red-400"
                : "bg-garden-light text-garden-green hover:bg-garden-green hover:text-white border border-garden-green/30"
            }`}
          >
            {inPlan ? "✓" : "+"}
          </button>
        </div>
      </div>
    </div>
  );
}
