import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { enrichShow } from "../utils/showMeta";

export default function ShowDetails() {
  const { id } = useParams();

  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.tvmaze.com/shows/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setShow(enrichShow(data));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar search="" setSearch={() => {}} />
        <p className="text-center mt-5">Loading show...</p>
      </>
    );
  }

  if (!show) {
    return (
      <>
        <Navbar search="" setSearch={() => {}} />
        <p className="text-center mt-5">Show not found.</p>
      </>
    );
  }

  const posterUrl = show.image?.original || "https://placehold.co/400x560?text=No+Poster";

  return (
    <>
      <Navbar search="" setSearch={() => {}} />
      <div className="page-wrap">
        <Link to="/" className="d-inline-block mb-3 text-decoration-none text-light">
          ← Back to browse
        </Link>

        <div className="row">
          <div className="col-md-5">
            <img src={posterUrl} alt={show.name} className="img-fluid rounded" />
          </div>
          <div className="col-md-7">
            <h3>{show.name}</h3>
            <p className="fs-5 fw-bold">₹{show.priceINR} to rent</p>
            <span className="badge bg-warning text-dark mb-3">
              ★ {show.rating?.average || "N/A"}
            </span>

            <div
              className="mt-3"
              dangerouslySetInnerHTML={{ __html: show.summary || "No summary available." }}
            />

            <div className="mb-2 mt-3">
              <strong>Type:</strong> {show.type}
            </div>
            <div className="mb-2">
              <strong>Language:</strong> {show.language}
            </div>
            <div className="mb-2">
              <strong>Genres:</strong> {show.genres?.join(", ") || "N/A"}
            </div>
            <div className="mb-2">
              <strong>Theme:</strong> {show.theme}
            </div>
            <div className="mb-2">
              <strong>Format:</strong> {show.pattern}
            </div>
            <div className="mb-2">
              <strong>Collection:</strong> {show.collection}
            </div>
            <div className="mb-3">
              <strong>Premiered:</strong> {show.premiered || "Unknown"}
            </div>

            <button className="btn btn-danger px-4">Rent Now</button>
          </div>
        </div>
      </div>
    </>
  );
}
