"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import type { Plant, CalendarEntry, Activity } from "@/types";
import { MONTH_NAMES, ACTIVITY_LABELS, ACTIVITY_COLOURS, TYPE_EMOJI } from "@/types";

type ActivityMap = Record<string, Activity[]>; // plantId → activities in this month

export default function PlannerPage() {
  const currentMonth = new Date().getMonth() + 1; // 1-based
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [plants, setPlants]               = useState<Plant[]>([]);
  const [activityMap, setActivityMap]     = useState<ActivityMap>({});
  const [selectedIds, setSelectedIds]     = useState<Set<string>>(new Set());
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      // Fetch all calendar entries for the selected month
      const { data: entries } = await supabase
        .from("planting_calendar")
        .select("plant_id, activity, month_start, month_end");

      const matchingPlantIds = new Set<string>();
      const map: ActivityMap = {};

      for (const e of entries ?? []) {
        if (monthInRange(selectedMonth, e.month_start, e.month_end)) {
          matchingPlantIds.add(e.plant_id);
          if (!map[e.plant_id]) map[e.plant_id] = [];
          if (!map[e.plant_id].includes(e.activity)) {
            map[e.plant_id].push(e.activity);
          }
        }
      }

      setActivityMap(map);

      if (matchingPlantIds.size === 0) {
        setPlants([]);
        setLoading(false);
        return;
      }

      const { data: plantData } = await supabase
        .from("plants")
        .select("*")
        .in("id", [...matchingPlantIds])
        .order("name_en");

      setPlants(plantData ?? []);
      setLoading(false);
    }

    load();
  }, [selectedMonth]);

  function togglePlant(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const myPlan = plants.filter((p) => selectedIds.has(p.id));

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-garden-green mb-2">📅 Monthly Planner</h1>
        <p className="text-gray-500">
          Choose a month to see what you can plant, then click the plants you want to add to your plan.
        </p>
      </div>

      {/* Month selector */}
      <div className="flex flex-wrap gap-2 mb-8">
        {MONTH_NAMES.map((name, i) => {
          const month = i + 1;
          return (
            <button
              key={month}
              onClick={() => setSelectedMonth(month)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedMonth === month
                  ? "bg-garden-green text-white shadow-sm scale-105"
                  : month === currentMonth
                  ? "bg-garden-light/50 text-garden-green border border-garden-green"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-garden-green"
              }`}
            >
              {name.slice(0, 3)}
              {month === currentMonth && selectedMonth !== month && (
                <span className="ml-1 text-xs opacity-60">(now)</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: plant picker */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            🌿 Plants for <span className="text-garden-green">{MONTH_NAMES[selectedMonth - 1]}</span>
            {!loading && <span className="text-sm font-normal text-gray-400 ml-2">({plants.length} plants)</span>}
          </h2>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : plants.length === 0 ? (
            <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
              <p className="text-4xl mb-3">❄️</p>
              <p>Nothing to plant this month! Try a different month.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {plants.map((plant) => {
                const isSelected = selectedIds.has(plant.id);
                const activities = activityMap[plant.id] ?? [];
                return (
                  <button
                    key={plant.id}
                    onClick={() => togglePlant(plant.id)}
                    className={`relative card text-left transition-all ${
                      isSelected
                        ? "ring-2 ring-garden-green ring-offset-1 shadow-md"
                        : "hover:shadow-md"
                    }`}
                  >
                    {/* Selected tick */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-garden-green rounded-full flex items-center justify-center z-10 shadow">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                    )}

                    {/* Image */}
                    <div className="relative h-28 bg-garden-light/20">
                      {plant.image_url ? (
                        <Image
                          src={plant.image_url}
                          alt={plant.name_en}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">
                          {TYPE_EMOJI[plant.type]}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <p className="font-semibold text-sm text-gray-800 truncate">{plant.name_en}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {activities.map((a) => (
                          <span key={a} className={`badge text-[10px] ${ACTIVITY_COLOURS[a]}`}>
                            {ACTIVITY_LABELS[a]}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: my plan */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <div className="card p-5">
              <h2 className="text-lg font-semibold text-garden-green mb-1">
                🗒️ My Plan — {MONTH_NAMES[selectedMonth - 1]}
              </h2>
              <p className="text-xs text-gray-400 mb-4">Click plants on the left to add them here.</p>

              {myPlan.length === 0 ? (
                <div className="py-10 text-center text-gray-300">
                  <p className="text-3xl mb-2">🪴</p>
                  <p className="text-sm">No plants selected yet</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {myPlan.map((plant) => {
                    const activities = activityMap[plant.id] ?? [];
                    return (
                      <li
                        key={plant.id}
                        className="flex items-center gap-3 p-2 bg-garden-cream rounded-xl"
                      >
                        <span className="text-xl">{TYPE_EMOJI[plant.type]}</span>
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/plants/${plant.slug}`}
                            className="text-sm font-medium text-gray-800 hover:text-garden-green truncate block"
                          >
                            {plant.name_en}
                          </Link>
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {activities.map((a) => (
                              <span key={a} className={`badge text-[9px] ${ACTIVITY_COLOURS[a]}`}>
                                {ACTIVITY_LABELS[a]}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => togglePlant(plant.id)}
                          className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
                          title="Remove"
                        >
                          ×
                        </button>
                      </li>
                    );
                  })}
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
          </div>
        </div>
      </div>
    </div>
  );
}

function monthInRange(month: number, start: number, end: number): boolean {
  if (start <= end) return month >= start && month <= end;
  return month >= start || month <= end;
}
