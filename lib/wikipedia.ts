/**
 * Returns a URL for a plant image routed through our own proxy API.
 * The proxy fetches from Wikipedia server-side (where Wikimedia allows it)
 * so the browser never hits upload.wikimedia.org directly.
 *
 * Returns null only when neither name is provided.
 */
export function getPlantImageUrl(
  latinName: string | null,
  englishName: string
): string {
  const params = new URLSearchParams();
  if (latinName) params.set("latin", latinName);
  params.set("name", englishName);
  return `/api/plant-image?${params.toString()}`;
}
