import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chichi Garden Planner",
  description: "Plan your Belgian garden — know what to plant, when, and with what.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-garden-cream min-h-screen font-sans text-gray-800">
        {/* ── Navigation ── */}
        <header className="bg-garden-green text-white shadow-md">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight hover:opacity-90 shrink-0">
              <span>🌱</span>
              <span>Chichi Garden Planner</span>
            </Link>
            <nav className="flex items-center gap-2 sm:gap-5 text-sm font-medium flex-wrap">
              <Link href="/browse" className="hover:text-garden-light transition-colors px-1">
                Browse Plants
              </Link>
              <Link href="/planner" className="hover:text-garden-light transition-colors px-1">
                Monthly View
              </Link>
              <Link
                href="/my-planner"
                className="bg-white text-garden-green rounded-full px-4 py-1.5 font-semibold hover:bg-garden-light transition-colors"
              >
                📋 My Planner
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
          🌍 Data adapted for Belgium (climate zone 8a/8b) &nbsp;·&nbsp; Chichi Garden Planner
        </footer>
      </body>
    </html>
  );
}
