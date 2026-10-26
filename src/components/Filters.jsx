const TYPES = ["Scripted", "Animation", "Documentary", "Reality", "Variety"];
const LANGUAGES = ["English", "Japanese", "Spanish", "German", "French"];
const THEMES = ["Anime", "Marvel", "Sports", "Music", "Other"];
const COLLECTIONS = ["New Arrivals", "Bestsellers", "Trending", "Seasonal"];
const PATTERNS = ["2D", "3D", "Series", "Documentary", "Animated"];

const PRICE_RANGES = [
  { label: "Under ₹180", min: 0, max: 180 },
  { label: "₹180 - ₹210", min: 180, max: 210 },
  { label: "₹210 - ₹240", min: 210, max: 240 },
  { label: "Above ₹240", min: 240, max: Infinity },
];

export default function Filters({ filters, setFilters, shows }) {
  function toggle(group, value) {
    setFilters((prev) => {
      const current = prev[group];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [group]: next };
    });
  }

  function setPriceRange(range) {
    setFilters((prev) => ({
      ...prev,
      priceRange: prev.priceRange?.label === range.label ? null : range,
    }));
  }

  function clearAll() {
    setFilters({
      type: [],
      language: [],
      theme: [],
      collection: [],
      pattern: [],
      priceRange: null,
    });
  }

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

  function countFor(group, value) {
    return shows.filter((s) => {
      if (group === "type") return s.type === value;
      if (group === "language") return s.language === value;
      if (group === "theme") return s.theme === value;
      if (group === "collection") return s.collection === value;
      if (group === "pattern") return s.pattern === value;
      return false;
    }).length;
  }

  const appliedChips = [
    ...filters.type.map((v) => ({ group: "type", value: v, label: v })),
    ...filters.language.map((v) => ({ group: "language", value: v, label: v })),
    ...filters.theme.map((v) => ({ group: "theme", value: v, label: v })),
    ...filters.collection.map((v) => ({ group: "collection", value: v, label: v })),
    ...filters.pattern.map((v) => ({ group: "pattern", value: v, label: v })),
    ...(filters.priceRange
      ? [{ group: "priceRange", value: filters.priceRange.label, label: filters.priceRange.label }]
      : []),
  ];

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

      {renderCheckGroup("TYPE", "type", TYPES)}
      {renderCheckGroup("LANGUAGE", "language", LANGUAGES)}
      {renderCheckGroup("THEME", "theme", THEMES)}
      {renderCheckGroup("COLLECTION", "collection", COLLECTIONS)}
      {renderCheckGroup("FORMAT", "pattern", PATTERNS)}

      <div className="filter-group">
        <p className="filter-label">RENTAL PRICE</p>
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
