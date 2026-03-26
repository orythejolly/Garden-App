import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  getPlantBySlug,
  getCalendarForPlant,
  getCompanionsForPlant,
  getAllPlants,
} from "@/lib/supabase";
import {
  MONTHS,
  ACTIVITY_LABELS,
  ACTIVITY_COLOURS,
  RELATIONSHIP_COLOURS,
  TYPE_EMOJI,
} from "@/types";

export const revalidate = 3600;

// Pre-generate all plant pages at build time
export async function generateStaticParams() {
  const plants = await getAllPlants();
  return plants.map((p) => ({ slug: p.slug }));
}

export default async function PlantPage({ params }: { params: { slug: string } }) {
  const [plant, calendar, companions] = await Promise.all([
    getPlantBySlug(params.slug),
    getPlantBySlug(params.slug).then((p) =>
      p ? getCalendarForPlant(p.id) : []
    ),
    getPlantBySlug(params.slug).then((p) =>
      p ? getCompanionsForPlant(p.id) : []
    ),
  ]);

  if (!plant) notFound();

  const beneficial = companions.filter((c) => c.relationship === "beneficial");
  const harmful    = companions.filter((c) => c.relationship === "harmful");

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back */}
      <Link href="/" className="text-sm text-garden-green hover:underline mb-6 inline-block">
        ← All plants
      </Link>

      {/* Header */}
      <div className="card mb-6 overflow-hidden">
        <div className="relative h-64 bg-garden-light/30">
          {plant.image_url ? (
            <Image
              src={plant.image_url}
              alt={plant.name_en}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl">
              {TYPE_EMOJI[plant.type]}
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-garden-green">{plant.name_en}</h1>
              {plant.name_latin && (
                <p className="text-gray-400 italic text-sm mt-0.5">{plant.name_latin}</p>
              )}
              {(plant.name_fr || plant.name_nl) && (
                <p className="text-gray-500 text-sm mt-1">
                  {[plant.name_fr, plant.name_nl].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="badge bg-garden-light text-garden-green text-sm px-3 py-1">
                {TYPE_EMOJI[plant.type]} {plant.type}
              </span>
              <span
                className={`badge text-sm px-3 py-1 ${
                  plant.difficulty === "easy"
                    ? "bg-green-100 text-green-700"
                    : plant.difficulty === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {plant.difficulty}
              </span>
            </div>
          </div>

          {plant.variety && (
            <p className="text-sm text-garden-earth font-medium mt-2">
              🌱 Variety: {plant.variety}
            </p>
          )}

          {plant.description && (
            <p className="mt-4 text-gray-600 leading-relaxed">{plant.description}</p>
          )}

          {/* Quick stats */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label="Days to harvest" value={plant.days_to_harvest ? `~${plant.days_to_harvest} days` : "—"} />
            <Stat label="Outdoor" value={plant.outdoor ? "✅ Yes" : "❌ No"} />
            <Stat label="Greenhouse" value={plant.greenhouse ? "✅ Yes" : "❌ No"} />
            <Stat label="Difficulty" value={plant.difficulty} />
          </div>

          {plant.notes && (
            <div className="mt-4 bg-garden-cream border border-garden-light rounded-xl p-4 text-sm text-gray-600">
              <span className="font-semibold text-garden-green">💡 Belgium tip: </span>
              {plant.notes}
            </div>
          )}

          {plant.growing_tips && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-gray-700">
              <p className="font-semibold text-blue-800 mb-1">📖 How to grow</p>
              <p className="leading-relaxed">{plant.growing_tips}</p>
            </div>
          )}
        </div>
      </div>

      {/* Calendar */}
      {calendar.length > 0 && (
        <section className="card mb-6 p-6">
          <h2 className="text-xl font-bold text-garden-green mb-4">📅 Planting Calendar</h2>
          <div className="space-y-4">
            {calendar.map((entry) => (
              <div key={entry.id}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`badge ${ACTIVITY_COLOURS[entry.activity]}`}>
                    {ACTIVITY_LABELS[entry.activity]}
                  </span>
                  {entry.location && (
                    <span className="text-xs text-gray-400">{entry.location}</span>
                  )}
                </div>
                {/* Month bar */}
                <div className="grid grid-cols-12 gap-0.5">
                  {MONTHS.map((m, i) => {
                    const month = i + 1;
                    const inRange = monthInRange(month, entry.month_start, entry.month_end);
                    return (
                      <div key={m} className="text-center">
                        <div
                          className={`h-6 rounded text-[10px] flex items-center justify-center font-medium ${
                            inRange
                              ? entry.activity === "harvest"
                                ? "bg-orange-300 text-orange-900"
                                : entry.activity === "sow_indoor"
                                ? "bg-blue-300 text-blue-900"
                                : entry.activity === "transplant"
                                ? "bg-yellow-300 text-yellow-900"
                                : "bg-green-300 text-green-900"
                              : "bg-gray-100 text-gray-300"
                          }`}
                        />
                        <p className="text-[9px] text-gray-400 mt-0.5">{m}</p>
                      </div>
                    );
                  })}
                </div>
                {entry.notes && (
                  <p className="text-xs text-gray-500 mt-1 italic">{entry.notes}</p>
                )}
              </div>
            ))}
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-gray-100 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-300 inline-block" /> Sow indoors</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-300 inline-block" /> Transplant</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-300 inline-block" /> Sow outdoors</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-300 inline-block" /> Harvest</span>
          </div>
        </section>
      )}

      {/* Companions */}
      {companions.length > 0 && (
        <section className="card mb-6 p-6">
          <h2 className="text-xl font-bold text-garden-green mb-4">🤝 Companion Planting</h2>

          {beneficial.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-green-700 mb-2">✅ Good neighbours</h3>
              <div className="space-y-2">
                {beneficial.map((c) => (
                  <CompanionRow key={c.id} companion={c} />
                ))}
              </div>
            </div>
          )}

          {harmful.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-red-700 mb-2">⛔ Avoid planting together</h3>
              <div className="space-y-2">
                {harmful.map((c) => (
                  <CompanionRow key={c.id} companion={c} />
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

// ── Helper components ───────────────────────────────────────────

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-garden-cream rounded-xl p-3 text-center">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-semibold text-gray-700 mt-0.5">{value}</p>
    </div>
  );
}

function CompanionRow({ companion }: { companion: any }) {
  const plant = companion.companion;
  if (!plant) return null;
  return (
    <Link
      href={`/plants/${plant.slug}`}
      className={`flex items-center gap-3 p-3 rounded-xl border transition-shadow hover:shadow-sm ${RELATIONSHIP_COLOURS[companion.relationship as any]}`}
    >
      <span className="text-2xl">{TYPE_EMOJI[plant.type as any]}</span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{plant.name_en}</p>
        {companion.reason && (
          <p className="text-xs opacity-75 truncate">{companion.reason}</p>
        )}
      </div>
    </Link>
  );
}

// ── Utility ─────────────────────────────────────────────────────

function monthInRange(month: number, start: number, end: number): boolean {
  if (start <= end) return month >= start && month <= end;
  return month >= start || month <= end;
}
