// =============================================================
// productMeta.js — FAKE DATA GENERATOR for fields the real API
// does not provide (theme, collection, pattern, size, color, gender)
// =============================================================
// WHY THIS FILE EXISTS (the actual problem it solves):
// We're fetching real products from a public API (FakeStoreAPI).
// That API gives us: id, title, price, category, image, rating.
// It does NOT give us: size, color, gender, theme, collection, pattern.
// But our task requires filtering by ALL of those things.
//
// THE OPTIONS WE HAD:
//   1. Pay for / build a real backend database with those fields. (too
//      slow for a learning project, and not what this task is testing)
//   2. Hard-code the SAME values on every product (e.g. everything is
//      "Anime" theme). This would make filtering pointless — every
//      filter would show either everything or nothing.
//   3. DERIVE consistent values from data we DO have (the product's id),
//      using simple math, so the SAME product always gets the SAME
//      theme/color/size every time the page loads (not random).
//
// We're doing option 3. This is a completely normal, real technique
// used in real projects when working around an incomplete API.
//
// THE CORE TRICK: the modulo operator (%)
// "id % array.length" always gives a number between 0 and
// (array.length - 1) — which is exactly a valid INDEX into that array.
// Different ids land on different array positions, so products get
// spread out across all the options, but any single id ALWAYS maps to
// the same option (because the math is deterministic — same input,
// same output, every single time).

// ---- POOLS OF POSSIBLE VALUES ----
// These are just plain arrays holding all the choices a product can get.
// This is also exactly where the NEW filters for this task plug in:
// theme / collection / pattern.

const SIZE_POOL = ["XS", "S", "M", "L", "XL", "XXL"];

const COLOR_POOL = [
  { name: "Black", hex: "#111111" },
  { name: "White", hex: "#f5f5f5" },
  { name: "Navy", hex: "#1b2a4a" },
  { name: "Red", hex: "#c0392b" },
  { name: "Olive", hex: "#6b7a3a" },
  { name: "Grey", hex: "#8a8a8a" },
];

// NEW for this task: theme filter (Anime, Marvel, Sports, Music, Other)
const THEME_POOL = ["Anime", "Marvel", "Sports", "Music", "Other"];

// NEW for this task: collection filter
const COLLECTION_POOL = ["New Arrivals", "Bestsellers", "Trending", "Seasonal"];

// NEW for this task: pattern filter
const PATTERN_POOL = ["Solid", "Printed", "Striped", "Checked", "Graphic"];

// ---- HELPER FUNCTIONS ----
// Small functions that each do ONE job. Breaking logic into small named
// functions (instead of one giant blob) makes it easier to read AND to
// test/debug — if something's wrong with category detection, you know
// to look inside pickCategory() specifically.

function pickCategory(title) {
  // .toLowerCase() so "T-Shirt" and "t-shirt" are treated the same way
  const t = title.toLowerCase();
  if (t.includes("t-shirt") || t.includes("tee") || (t.includes("shirt") && t.includes("casual")))
    return "T-Shirts";
  if (t.includes("shirt")) return "Shirts";
  if (t.includes("jean") || t.includes("denim")) return "Jeans";
  if (t.includes("hoodie") || t.includes("jacket")) return "Hoodies";
  return "Other";
}

function pickGender(apiCategory) {
  // apiCategory is the REAL field FakeStoreAPI gives us (e.g. "men's clothing")
  // We translate it into the simpler Men/Women/Unisex labels our UI uses.
  if (apiCategory === "men's clothing") return "Men";
  if (apiCategory === "women's clothing") return "Women";
  return "Unisex";
}

// =============================================================
// enrichProduct() — THE MAIN FUNCTION OF THIS FILE
// =============================================================
// Takes ONE raw product object from the API, and returns a NEW object
// that has all the original fields PLUS all our made-up filter fields
// bolted on. We call this "enriching" the data.
//
// WHERE THIS GETS CALLED FROM:
// In Home.jsx, after fetch() gets the raw array of products from the
// API, we do: data.map(enrichProduct)
// .map() runs this function on EVERY product in the array and collects
// the results into a new array. So the whole product list becomes
// "enriched" in one line.
export function enrichProduct(p) {
  // --- size: give each product 3 available sizes out of the 6 possible ---
  // sizeStart decides WHERE in the SIZE_POOL array we start picking from.
  const sizeStart = p.id % SIZE_POOL.length;
  const sizes = [
    SIZE_POOL[sizeStart],
    SIZE_POOL[(sizeStart + 1) % SIZE_POOL.length], // +1, wrapping around
    SIZE_POOL[(sizeStart + 2) % SIZE_POOL.length], // +2, wrapping around
  ];

  // --- color: pick ONE deterministic color for this product ---
  const color = COLOR_POOL[p.id % COLOR_POOL.length];

  // --- NEW: theme ---
  // We multiply id by a different number (7) before taking % so that
  // theme doesn't land in sync with color/size (otherwise id=0 would
  // always be "first of everything", id=1 always "second of everything",
  // which looks suspiciously patterned on screen). Multiplying scrambles
  // the pattern a bit while staying 100% deterministic.
  const theme = THEME_POOL[(p.id * 7) % THEME_POOL.length];

  // --- NEW: collection ---
  const collection = COLLECTION_POOL[(p.id * 3) % COLLECTION_POOL.length];

  // --- NEW: pattern ---
  const pattern = PATTERN_POOL[(p.id * 5) % PATTERN_POOL.length];

  // --- price in Indian Rupees ---
  // The API gives price in USD. 83 is an approximate USD->INR rate.
  // Math.round() removes decimal points so we don't show ₹109.95443
  const priceINR = Math.round(p.price * 83);

  // --- spread operator (...p) ---
  // "...p" copies every existing field from the original product
  // (id, title, price, category, image, rating) into our new object.
  // Then we ADD our new fields after it. This way we don't lose any
  // of the real API data — we're just extending it.
  return {
    ...p,
    gender: pickGender(p.category),
    subCategory: pickCategory(p.title),
    sizes,
    color,
    theme,
    collection,
    pattern,
    priceINR,
  };
}
