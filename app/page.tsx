import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-10 text-center">
        <div className="text-6xl mb-4">🌱</div>
        <h1 className="text-5xl font-bold text-garden-green mb-4 leading-tight">
          Chichi Garden Planner
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-lg leading-relaxed">
          Your personal guide to growing a beautiful Belgian garden.
          127 plants, seasonal calendars, and companion planting — all in one place.
        </p>
      </section>

      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
        <FeatureCard
          emoji="📅"
          title="Monthly View"
          description="Pick any month and discover exactly what to sow, plant, and harvest right now. Tailored to the Belgian climate."
          href="/planner"
          cta="Open Monthly View"
          accent="border-blue-200 hover:border-blue-400"
          badge="bg-blue-50 text-blue-700"
        />
        <FeatureCard
          emoji="🌿"
          title="Browse All Plants"
          description="Explore all 127 vegetables, fruits, herbs, and flowers. Filter by type, location, difficulty, or search by name."
          href="/browse"
          cta="Browse Plants"
          accent="border-green-200 hover:border-green-400"
          badge="bg-green-50 text-green-700"
        />
        <FeatureCard
          emoji="📋"
          title="My Planner"
          description="Build your own garden plan. Add plants, see their year-round calendar, and check which ones grow well together."
          href="/my-planner"
          cta="Start Planning"
          accent="border-orange-200 hover:border-orange-400"
          badge="bg-orange-50 text-orange-700"
        />
      </div>

      {/* Stats row */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard emoji="🌱" value="127" label="Plants" />
        <StatCard emoji="🥦" value="50" label="Vegetables" />
        <StatCard emoji="🍓" value="47" label="Fruits" />
        <StatCard emoji="🌸" value="30" label="Herbs & Flowers" />
      </div>

      {/* Tip */}
      <div className="mt-10 bg-garden-light/40 border border-garden-light rounded-2xl p-5 text-center text-sm text-garden-green">
        <strong>🇧🇪 Built for Belgium</strong> — all planting dates are calibrated for climate zones 8a/8b (Brussels, Ghent, Antwerp, Liège…)
      </div>
    </div>
  );
}

function FeatureCard({
  emoji, title, description, href, cta, accent, badge,
}: {
  emoji: string; title: string; description: string;
  href: string; cta: string; accent: string; badge: string;
}) {
  return (
    <Link
      href={href}
      className={`card border-2 ${accent} p-6 hover:shadow-lg transition-all group block`}
    >
      <span className={`inline-block ${badge} text-xs font-semibold px-2 py-0.5 rounded-full mb-3`}>
        {emoji} {title}
      </span>
      <h2 className="text-xl font-bold text-garden-green mb-2">{title}</h2>
      <p className="text-gray-500 text-sm leading-relaxed mb-5">{description}</p>
      <span className="text-garden-green font-semibold text-sm group-hover:underline">
        {cta} →
      </span>
    </Link>
  );
}

function StatCard({ emoji, value, label }: { emoji: string; value: string; label: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
      <div className="text-2xl mb-1">{emoji}</div>
      <div className="text-2xl font-bold text-garden-green">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}
