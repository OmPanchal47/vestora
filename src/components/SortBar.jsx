// =============================================================
// SortBar.jsx — THE "SORT BY" DROPDOWN
// =============================================================
// WHY SORTING IS A SEPARATE COMPONENT FROM FILTERS:
// Filtering and sorting are DIFFERENT operations, even though they
// both change what you see on screen:
//   - FILTERING removes items that don't match (the array gets SHORTER).
//   - SORTING just reorders the SAME items (the array stays the SAME
//     LENGTH, items just appear in a different order).
// Keeping them visually and logically separate makes it much easier to
// reason about bugs later ("is my sort broken, or my filter?").
//
// HOW THIS CONNECTS TO HOME.JSX:
// Exactly the same prop pattern as the search box: Home.jsx owns the
// "sortBy" state (just a string like "priceLowHigh"), and passes it
// down here along with setSortBy so this dropdown can change it.

export default function SortBar({ sortBy, setSortBy, count }) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <p className="mb-0 text-muted">{count} products</p>

      {/* A native HTML <select> dropdown. value={sortBy} keeps it in
          sync with React state (controlled component, same idea as the
          search input). e.target.value gives us whichever <option>'s
          "value" attribute the user picked. */}
      <select
        className="form-select"
        style={{ width: "220px" }}
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="">Sort by</option>
        <option value="priceLowHigh">Price: Low to High</option>
        <option value="priceHighLow">Price: High to Low</option>
        <option value="newest">Newest Arrivals</option>
        <option value="popularity">Popularity</option>
        <option value="rating">Customer Rating</option>
      </select>
    </div>
  );
}
