import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Cache image responses for 24 hours at the CDN level
export const revalidate = 86400;

/**
 * Proxy route that fetches a plant image from Wikipedia server-side and
 * streams it back to the browser. Wikimedia blocks direct browser hotlinking,
 * but server-to-server requests work fine.
 *
 * Usage: /api/plant-image?latin=Solanum+lycopersicum&name=Tomato
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const latin = searchParams.get("latin") ?? "";
  const name  = searchParams.get("name") ?? "";

  const names = [latin, name].filter(Boolean);

  for (const query of names) {
    try {
      // 1. Ask Wikipedia REST API for the page summary (includes thumbnail)
      const apiRes = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`,
        {
          headers: {
            "User-Agent":
              "ChichiGardenPlanner/1.0 (https://chichi-garden-planner.netlify.app; contact@chichi.garden)",
            Accept: "application/json",
          },
          // Next.js cache — reuse across requests for 24 h
          next: { revalidate: 86400 },
        }
      );

      if (!apiRes.ok) continue;

      const data = await apiRes.json();
      const imageUrl: string | undefined = data?.thumbnail?.source;
      if (!imageUrl) continue;

      // 2. Fetch the actual image from Wikimedia with a proper User-Agent
      const imgRes = await fetch(imageUrl, {
        headers: {
          "User-Agent":
            "ChichiGardenPlanner/1.0 (https://chichi-garden-planner.netlify.app; contact@chichi.garden)",
          Referer: "https://en.wikipedia.org/",
        },
      });

      if (!imgRes.ok) continue;

      const contentType = imgRes.headers.get("content-type") ?? "image/jpeg";
      const buffer = await imgRes.arrayBuffer();

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
        },
      });
    } catch {
      // try next name
    }
  }

  // Nothing found — return a transparent 1×1 pixel so the browser doesn't show a broken icon
  const pixel = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
    "base64"
  );
  return new NextResponse(pixel, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
