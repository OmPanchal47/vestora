// =============================================================
// Home.jsx — THE MAIN PAGE: fetches data, holds ALL state, combines
// search + every filter + sorting into the final list shown on screen
// =============================================================
// WHY ALL THE STATE LIVES HERE (and not inside Navbar/Filters/SortBar):
// This is the "lift state up" pattern mentioned in Navbar.jsx and
// Filters.jsx. Home.jsx is the PARENT of all three. By keeping
// "products", "search", "filters", and "sortBy" all here, every child
// component can read/write the SAME shared data, and Home.jsx is the
// one place that combines them all to decide what actually renders.

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Filters from "../components/Filters";
import SortBar from "../components/SortBar";
import ProductCard from "../components/ProductCard";
import { enrichProduct } from "../utils/productMeta";

export default function Home() {
  // ---- STATE: the raw product list fetched from the API ----
  const [products, setProducts] = useState([]); // starts empty until fetch finishes
  const [loading, setLoading] = useState(true); // true while we're waiting on the network

  // ---- STATE: search text typed into the Navbar ----
  const [search, setSearch] = useState("");

  // ---- STATE: every filter group, all starting EMPTY (nothing selected) ----
  // Each array being empty means "no restriction on this field" — our
  // filtering logic below treats an empty array as "match everything".
  const [filters, setFilters] = useState({
    size: [],
    gender: [],
    category: [],
    color: [],
    theme: [],
    collection: [],
    pattern: [],
    priceRange: null, // null = no price restriction
  });

  // ---- STATE: current sort choice (empty string = no sorting applied) ----
  const [sortBy, setSortBy] = useState("");

  // =============================================================
  // FETCHING DATA: useEffect + fetch()
  // =============================================================
  // WHY useEffect:
  // React components re-run their function body every time state
  // changes, just to figure out what to display. If we called fetch()
  // directly in the function body (not inside useEffect), it would
  // re-fetch from the network EVERY single re-render — including every
  // time the user types a letter in search, or clicks a checkbox. That
  // would be extremely wasteful and slow.
  // useEffect(() => { ... }, []) with an EMPTY dependency array [] means
  // "only run this function ONCE, right after the component first
  // appears on screen" — exactly what we want for an initial data load.
  //
  // WHY fetch() (the Fetch API):
  // fetch(url) is a built-in browser function (no installation needed —
  // this is why "Fetch API" was listed in your required tech stack but
  // we never npm installed anything for it) that sends an HTTP request
  // to a server and returns a Promise. A Promise represents "a value
  // that isn't ready yet, but will be eventually." We use .then() to
  // say "once that value IS ready, do this next."
  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json()) // the raw response isn't usable JS data yet —
                                   // .json() parses the response body (text)
                                   // into an actual JS array of objects.
                                   // This ALSO returns a Promise, so we chain
                                   // another .then() after it.
      .then((data) => {
        // data = the raw array straight from the API (no theme/collection/
        // pattern/size/color yet). We run EVERY product through
        // enrichProduct() (imported from productMeta.js) to add those
        // missing fields before storing it in state.
        setProducts(data.map(enrichProduct));
        setLoading(false); // we're done waiting, hide the "Loading..." message
      })
      .catch((err) => {
        // .catch() runs if the network request fails entirely (e.g. no
        // internet, server down). console.log just logs it to the
        // browser's dev console for debugging — a real production app
        // might show an error message to the user instead.
        console.log(err);
        setLoading(false);
      });
  }, []); // empty array = run once on mount, never again

  // =============================================================
  // FILTERING: one function that applies EVERY active filter + search
  // =============================================================
  // WHY ONE FUNCTION INSTEAD OF SEPARATE FILTER STEPS:
  // We loop through "products" ONCE and check every condition per item,
  // which is simpler to read and reason about than chaining many
  // separate .filter() calls back to back (both achieve the same
  // result — this is just the more beginner-readable version).
  //
  // HOW "COMBINING MULTIPLE FILTERS" WORKS (this answers Stage 5 from
  // your task: "Allow users to combine multiple filters"):
  // Each filter check below is an independent "if this condition fails,
  // skip this product" (`continue`) statement. Because they're all
  // checked back-to-back on the SAME product before it's allowed into
  // the results, a product must pass EVERY active filter at once to
  // show up. This is called "AND" logic between different filter
  // GROUPS. (Within ONE group, like selecting both "Men" AND "Women"
  // genders, it's "OR" logic — filters.gender.includes(p.gender) matches
  // if the product's gender is ANY of the selected ones.)
  function getFilteredProducts() {
    let result = [];
    for (let i = 0; i < products.length; i++) {
      const p = products[i];

      // Search: if there's text typed, the product title must contain it
      // (case-insensitive, hence .toLowerCase() on both sides).
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) continue;

      // Each filter below: if the filter array has anything selected
      // AND this product's value isn't in that selection, skip it.
      // (If the array is empty, `filters.gender.length` is 0, which is
      // falsy, so the whole check short-circuits and we don't skip —
      // meaning "no filter selected" lets everything through.)
      if (filters.gender.length && !filters.gender.includes(p.gender)) continue;
      if (filters.category.length && !filters.category.includes(p.subCategory)) continue;
      if (filters.color.length && !filters.color.includes(p.color.name)) continue;
      if (filters.size.length && !p.sizes.some((s) => filters.size.includes(s))) continue;
      if (filters.theme.length && !filters.theme.includes(p.theme)) continue;
      if (filters.collection.length && !filters.collection.includes(p.collection)) continue;
      if (filters.pattern.length && !filters.pattern.includes(p.pattern)) continue;

      // Price range: unlike the arrays above, this is a single object
      // (or null). If one is selected, the product's INR price must
      // fall between min and max (inclusive on min, exclusive on max
      // doesn't matter much here, but we check both directions).
      if (filters.priceRange) {
        if (p.priceINR < filters.priceRange.min || p.priceINR > filters.priceRange.max) continue;
      }

      // If we reach this line, the product passed EVERY check above —
      // keep it.
      result.push(p);
    }
    return result;
  }

  // =============================================================
  // SORTING: reorders the ALREADY-FILTERED list (Stage 4)
  // =============================================================
  // WHY SORTING HAPPENS AFTER FILTERING (not before):
  // There's no need to waste time sorting products that are about to be
  // thrown away by a filter. Sorting the smaller, already-filtered list
  // is both more efficient and gives the correct final result either way.
  //
  // WHY WE COPY THE ARRAY FIRST ([...list]):
  // Array.prototype.sort() SORTS IN PLACE — it mutates (changes) the
  // original array instead of returning a new one. If we called
  // list.sort(...) directly on "products" or on the filtered result, we
  // could accidentally cause confusing bugs elsewhere. Spreading it into
  // a brand new array first ([...list]) means we only ever reorder a
  // throwaway COPY, leaving the original data untouched — a common
  // defensive habit in React (avoid mutating things directly).
  function getSortedProducts(list) {
    const sorted = [...list];

    if (sortBy === "priceLowHigh") {
      // sort() takes a "compare function" (a, b) => number.
      // If the result is negative, a comes first. Positive, b comes
      // first. Zero, leave their order unchanged.
      // a.priceINR - b.priceINR is negative when a is cheaper -> cheaper
      // items sort earlier -> ascending order (low to high).
      sorted.sort((a, b) => a.priceINR - b.priceINR);
    } else if (sortBy === "priceHighLow") {
      // Flipped subtraction -> descending order (high to low).
      sorted.sort((a, b) => b.priceINR - a.priceINR);
    } else if (sortBy === "newest") {
      // FakeStoreAPI has no "date added" field. As a reasonable stand-in,
      // we treat a HIGHER id as "added more recently" (a common
      // simplification when a real timestamp field doesn't exist).
      sorted.sort((a, b) => b.id - a.id);
    } else if (sortBy === "popularity") {
      // rating.count = how many people rated it. We use this as a
      // simple proxy for "popularity" (more reviews ~ more people
      // bought/used it).
      sorted.sort((a, b) => b.rating.count - a.rating.count);
    } else if (sortBy === "rating") {
      // rating.rate = the actual star rating (e.g. 4.5).
      sorted.sort((a, b) => b.rating.rate - a.rating.rate);
    }
    // if sortBy is "" (nothing picked), we skip all of the above and
    // just return the copy in its original (filtered) order.

    return sorted;
  }

  // Run both steps. Order matters: filter FIRST, sort SECOND.
  const filtered = getFilteredProducts();
  const finalList = getSortedProducts(filtered);

  return (
    <>
      <Navbar search={search} setSearch={setSearch} />
      <div className="page-wrap">
        <div className="row">
          <div className="col-lg-3">
            {/* "products" (the FULL unfiltered list) is passed to Filters
                ONLY so it can calculate the little option counts —
                it does NOT use this to decide what to show on the page
                itself; that's finalList's job below. */}
            <Filters filters={filters} setFilters={setFilters} products={products} />
          </div>
          <div className="col-lg-9">
            <div className="listing-head mb-2">
              <p className="crumb">Home / Shop</p>
              <h5>Shop</h5>
            </div>

            {/* count={finalList.length} so the number shown always
                matches exactly what's rendered below it */}
            <SortBar sortBy={sortBy} setSortBy={setSortBy} count={finalList.length} />

            {loading && <p className="text-center mt-5">Loading products...</p>}
            {!loading && finalList.length === 0 && (
              <p className="text-muted text-center mt-5">No products match your filters.</p>
            )}

            <div className="row">
              {/* .map() turns our array of product objects into an array
                  of <ProductCard /> elements — one per product.
                  key={p.id} is REQUIRED by React whenever you render a
                  list: it needs a stable, unique way to tell items apart
                  across re-renders (e.g. so it doesn't confuse product #3
                  with product #5 if the order changes after sorting). */}
              {finalList.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
