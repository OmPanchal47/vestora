// =============================================================
// Filters.jsx — THE ENTIRE FILTER SIDEBAR
// =============================================================
// WHY ALL FILTERS LIVE IN ONE COMPONENT (instead of splitting gender
// filter, color filter, etc into separate files):
// They all follow the EXACT same pattern (a list of checkbox options
// that toggle membership in an array), so splitting them into separate
// files would mean copy-pasting the same logic 7 times. Instead we
// write ONE reusable toggle() function and reuse it for every group.
//
// HOW DATA FLOWS (the big picture):
// - Home.jsx owns the REAL "filters" state object (useState).
// - This component receives "filters" (current values) and
//   "setFilters" (the function to change them) as props.
// - When the user clicks a checkbox here, we call setFilters(...),
//   which updates the state back in Home.jsx.
// - Home.jsx then re-filters the product list and re-renders — all
//   automatically, because React re-runs a component whenever its
//   state changes.
// This is the SAME "lift state up" pattern used for search in Navbar.

// ---- FILTER OPTION LISTS ----
// Plain arrays we loop over with .map() to generate the checkboxes.
// Adding a new option later = adding one string to the array, nothing
// else needs to change.
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const GENDERS = ["Men", "Women", "Unisex"];
const CATEGORIES = ["T-Shirts", "Shirts", "Jeans", "Hoodies", "Other"];
const COLORS = ["Black", "White", "Navy", "Red", "Olive", "Grey"];

// NEW for this task:
const THEMES = ["Anime", "Marvel", "Sports", "Music", "Other"];
const COLLECTIONS = ["New Arrivals", "Bestsellers", "Trending", "Seasonal"];
const PATTERNS = ["Solid", "Printed", "Striped", "Checked", "Graphic"];

// NEW for this task: predefined price ranges.
// Each option carries a label (for display) AND the actual min/max
// numbers (for the real filtering math). Storing both together means
// we never have to "parse" a label back into numbers later.
const PRICE_RANGES = [
  { label: "Under ₹1,000", min: 0, max: 1000 },
  { label: "₹1,000 - ₹5,000", min: 1000, max: 5000 },
  { label: "₹5,000 - ₹10,000", min: 5000, max: 10000 },
  { label: "Above ₹10,000", min: 10000, max: Infinity },
];

export default function Filters({ filters, setFilters, products }) {
  // ---- toggle(): the ONE function that handles EVERY checkbox group ----
  // "group" tells us WHICH filter category we're changing (e.g. "gender").
  // "value" is the specific option being clicked (e.g. "Men").
  function toggle(group, value) {
    setFilters((prev) => {
      // prev = the filters object BEFORE this change.
      // Using the "updater function" form of setState (passing a function
      // instead of a plain value) guarantees we're always working off the
      // most current state, which matters if multiple updates happen
      // close together.
      const current = prev[group]; // e.g. prev.gender -> ["Men"]

      const next = current.includes(value)
        ? current.filter((v) => v !== value) // already selected -> remove it
        : [...current, value]; // not selected yet -> add it

      // Spread prev (...prev) to keep every OTHER filter group untouched,
      // then overwrite just the one group ([group]: next) we changed.
      // [group] with square brackets is a "computed property name" — it
      // lets us use a VARIABLE as an object key instead of a hardcoded
      // name, which is exactly why one function can serve all groups.
      return { ...prev, [group]: next };
    });
  }

  // ---- setPriceRange(): special case, NOT a toggle ----
  // Price range isn't a list of multiple selectable chips — picking a
  // NEW range should REPLACE the old one, not add to a list. So this is
  // simpler than toggle(): it just overwrites filters.priceRange directly.
  // Clicking the SAME range again clears it (acts like a toggle of one).
  function setPriceRange(range) {
    setFilters((prev) => ({
      ...prev,
      priceRange: prev.priceRange?.label === range.label ? null : range,
    }));
  }

  // ---- clearAll(): resets every filter back to its empty starting state ----
  function clearAll() {
    setFilters({
      size: [],
      gender: [],
      category: [],
      color: [],
      theme: [],
      collection: [],
      pattern: [],
      priceRange: null,
    });
  }

  // ---- removeOne(): removes a SINGLE applied filter (Stage 6 requirement:
  // "display applied filters with options to remove individual filters") ----
  function removeOne(group, value) {
    if (group === "priceRange") {
      setFilters((prev) => ({ ...prev, priceRange: null }));
      return;
    }
    setFilters((prev) => ({
      ...prev,
      [group]: prev[group].filter((v) => v !== value),
    }));
  }

  // ---- countFor(): shows how many PRODUCTS match a given option ----
  // This is a UX nicety (seen on real e-commerce sites) — e.g. next to
  // "Men" it shows "(4)" so the user knows before clicking whether a
  // filter is even worth using. Runs against the FULL unfiltered product
  // list so the counts represent "if I added this filter, roughly how
  // many could match" rather than shrinking to 0 as filters stack up.
  function countFor(group, value) {
    return products.filter((p) => {
      if (group === "gender") return p.gender === value;
      if (group === "category") return p.subCategory === value;
      if (group === "color") return p.color.name === value;
      if (group === "size") return p.sizes.includes(value);
      if (group === "theme") return p.theme === value;
      if (group === "collection") return p.collection === value;
      if (group === "pattern") return p.pattern === value;
      return false;
    }).length;
  }

  // ---- Build a flat list of "chips" to display for Stage 6 ----
  // Every currently-active filter (across every group) gets turned into
  // one {group, value, label} object, so we can .map() over ONE array
  // to render all the applied-filter chips in one place, instead of
  // writing separate chip-rendering code per group.
  const appliedChips = [
    ...filters.gender.map((v) => ({ group: "gender", value: v, label: v })),
    ...filters.category.map((v) => ({ group: "category", value: v, label: v })),
    ...filters.size.map((v) => ({ group: "size", value: v, label: `Size: ${v}` })),
    ...filters.color.map((v) => ({ group: "color", value: v, label: v })),
    ...filters.theme.map((v) => ({ group: "theme", value: v, label: v })),
    ...filters.collection.map((v) => ({ group: "collection", value: v, label: v })),
    ...filters.pattern.map((v) => ({ group: "pattern", value: v, label: v })),
    ...(filters.priceRange
      ? [{ group: "priceRange", value: filters.priceRange.label, label: filters.priceRange.label }]
      : []),
  ];

  // Small reusable chunk of JSX for ONE checkbox filter group, so we
  // don't repeat the same <div><p>label</p>{options.map(...)}</div>
  // structure 7 separate times below. This is a plain JS function that
  // RETURNS jsx — not a separate component file, just a local helper.
  function renderCheckGroup(title, groupKey, options) {
    return (
      <div className="filter-group">
        <p className="filter-label">{title}</p>
        {options.map((opt) => (
          <label className="filter-row" key={opt}>
            <span>
              <input
                type="checkbox"
                checked={filters[groupKey].includes(opt)}
                onChange={() => toggle(groupKey, opt)}
              />
              {opt}
            </span>
            <small>{countFor(groupKey, opt)}</small>
          </label>
        ))}
      </div>
    );
  }

  return (
    <div className="filters-box">
      <div className="filters-head">
        <h6>FILTERS</h6>
        <button onClick={clearAll}>Clear all</button>
      </div>

      {/* ---- Applied filter chips (Stage 6) ----
          Only shown when at least one filter is active. Each chip has
          its own little "x" button that removes JUST that one filter,
          calling removeOne() with the specific group+value it belongs to. */}
      {appliedChips.length > 0 && (
        <div className="applied-chips mb-3">
          {appliedChips.map((chip) => (
            <span className="chip" key={`${chip.group}-${chip.value}`}>
              {chip.label}
              <button onClick={() => removeOne(chip.group, chip.value)}>×</button>
            </span>
          ))}
        </div>
      )}

      {renderCheckGroup("GENDER", "gender", GENDERS)}
      {renderCheckGroup("CATEGORY", "category", CATEGORIES)}

      <div className="filter-group">
        <p className="filter-label">SIZE</p>
        <div className="size-grid">
          {SIZES.map((s) => (
            <button
              key={s}
              className={`size-btn ${filters.size.includes(s) ? "active" : ""}`}
              onClick={() => toggle("size", s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {renderCheckGroup("COLOR", "color", COLORS)}
      {renderCheckGroup("THEME", "theme", THEMES)}
      {renderCheckGroup("COLLECTION", "collection", COLLECTIONS)}
      {renderCheckGroup("PATTERN", "pattern", PATTERNS)}

      {/* ---- Price range (NOT a checkbox group — single selection) ---- */}
      <div className="filter-group">
        <p className="filter-label">PRICE</p>
        {PRICE_RANGES.map((range) => (
          <label className="filter-row" key={range.label}>
            <span>
              <input
                type="checkbox"
                checked={filters.priceRange?.label === range.label}
                onChange={() => setPriceRange(range)}
              />
              {range.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
