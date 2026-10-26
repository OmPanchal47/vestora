import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Filters from "../components/Filters";
import SortBar from "../components/SortBar";
import ShowCard from "../components/ShowCard";
import { enrichShow } from "../utils/showMeta";

export default function Home() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    type: [],
    language: [],
    theme: [],
    collection: [],
    pattern: [],
    priceRange: null,
  });

  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    fetch("https://api.tvmaze.com/shows?page=0")
      .then((res) => res.json())
      .then((data) => {
        setShows(data.slice(0, 40).map(enrichShow));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  function getFilteredShows() {
    let result = [];
    for (let i = 0; i < shows.length; i++) {
      const s = shows[i];

      if (search && !s.name.toLowerCase().includes(search.toLowerCase())) continue;
      if (filters.type.length && !filters.type.includes(s.type)) continue;
      if (filters.language.length && !filters.language.includes(s.language)) continue;
      if (filters.theme.length && !filters.theme.includes(s.theme)) continue;
      if (filters.collection.length && !filters.collection.includes(s.collection)) continue;
      if (filters.pattern.length && !filters.pattern.includes(s.pattern)) continue;

      if (filters.priceRange) {
        if (s.priceINR < filters.priceRange.min || s.priceINR > filters.priceRange.max) continue;
      }

      result.push(s);
    }
    return result;
  }

  function getSortedShows(list) {
    const sorted = [...list];

    if (sortBy === "priceLowHigh") {
      sorted.sort((a, b) => a.priceINR - b.priceINR);
    } else if (sortBy === "priceHighLow") {
      sorted.sort((a, b) => b.priceINR - a.priceINR);
    } else if (sortBy === "newest") {
      sorted.sort((a, b) => {
        const aDate = a.premiered ? new Date(a.premiered).getTime() : 0;
        const bDate = b.premiered ? new Date(b.premiered).getTime() : 0;
        return bDate - aDate;
      });
    } else if (sortBy === "popularity") {
      sorted.sort((a, b) => (b.weight || 0) - (a.weight || 0));
    } else if (sortBy === "rating") {
      sorted.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
    }

    return sorted;
  }

  const filtered = getFilteredShows();
  const finalList = getSortedShows(filtered);

  return (
    <>
      <Navbar search={search} setSearch={setSearch} />
      <div className="page-wrap">
        <div className="row">
          <div className="col-lg-3">
            <Filters filters={filters} setFilters={setFilters} shows={shows} />
          </div>
          <div className="col-lg-9">
            <div className="listing-head mb-2">
              <p className="crumb">Home / Browse</p>
              <h5>Browse Shows</h5>
            </div>

            <SortBar sortBy={sortBy} setSortBy={setSortBy} count={finalList.length} />

            {loading && <p className="text-center mt-5">Loading shows...</p>}
            {!loading && finalList.length === 0 && (
              <p className="text-center mt-5">No shows match your filters.</p>
            )}

            <div className="row">
              {finalList.map((s) => (
                <ShowCard key={s.id} show={s} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
