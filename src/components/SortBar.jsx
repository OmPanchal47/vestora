export default function SortBar({ sortBy, setSortBy, count }) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <p className="mb-0 text-light-emphasis">{count} shows</p>

      <select
        className="form-select bg-dark text-light border-secondary"
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
