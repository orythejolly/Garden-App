/**
 * Fetches a thumbnail image URL from Wikipedia for a given plant name.
 * Tries the Latin name first, then the English name as fallback.
 * Results are cached by Next.js for 24 hours.
 */
export async function fetchWikipediaImage(
  latinName: string | null,
  englishName: string
): Promise<string | null> {
  const names = [latinName, englishName].filter(Boolean) as string[];

  for (const name of names) {
    try {
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`,
        { next: { revalidate: 86400 } } // cache for 24 hours
      );
      if (!res.ok) continue;
      const data = await res.json();
      if (data.thumbnail?.source) return data.thumbnail.source;
    } catch {
      // try next name
    }
  }
  return null;
}
