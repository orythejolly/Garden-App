import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Belgian Garden Planner",
  description: "Plan your Belgian garden — know what to plant, when, and with what.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-garden-cream min-h-screen font-sans text-gray-800">
        {/* ── Navigation ── */}
        <header className="bg-garden-green text-white shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight hover:opacity-90">
              <span>🌱</span>
              <span>Belgian Garden Planner</span>
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium">
              <Link href="/" className="hover:text-garden-light transition-colors">
                All Plants
              </Link>
              <Link href="/planner" className="hover:text-garden-light transition-colors">
                Monthly Planner
              </Link>
            </nav>
          </div>
        </header>

        {/* ── Page content ── */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>

        {/* ── Footer ── */}
        <footer className="mt-16 border-t border-gray-200 py-6 text-center text-sm text-gray-400">
          🌍 Data adapted for Belgium (climate zone 8a/8b) &nbsp;·&nbsp; Belgian Garden Planner
        </footer>
      </body>
    </html>
  );
}
