const THEME_POOL = ["Anime", "Marvel", "Sports", "Music", "Other"];
const COLLECTION_POOL = ["New Arrivals", "Bestsellers", "Trending", "Seasonal"];
const PATTERN_POOL = ["2D", "3D", "Series", "Documentary", "Animated"];

function pickTheme(genres, id) {
  const g = genres.join(" ").toLowerCase();
  if (g.includes("anime")) return "Anime";
  if (g.includes("action") || g.includes("adventure")) return "Marvel";
  if (g.includes("sport")) return "Sports";
  if (g.includes("music")) return "Music";
  return THEME_POOL[id % THEME_POOL.length];
}

export function enrichShow(s) {
  const theme = pickTheme(s.genres || [], s.id);
  const collection = COLLECTION_POOL[(s.id * 3) % COLLECTION_POOL.length];
  const pattern = PATTERN_POOL[(s.id * 7) % PATTERN_POOL.length];

  const rating = s.rating?.average || 5;
  const priceINR = Math.round(rating * 30);

  return {
    ...s,
    theme,
    collection,
    pattern,
    priceINR,
  };
}
