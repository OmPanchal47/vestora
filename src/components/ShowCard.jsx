import { Link } from "react-router-dom";

export default function ShowCard({ show }) {
  const posterUrl = show.image?.medium || "https://placehold.co/210x295?text=No+Poster";

  return (
    <div className="col-6 col-md-4 col-lg-3 mb-4">
      <Link to={`/show/${show.id}`} className="text-decoration-none text-light">
        <div className="card h-100 bg-secondary border-0 show-card">
          <div className="poster-wrap">
            <img src={posterUrl} alt={show.name} className="poster-img" />
          </div>
          <div className="card-body px-2 py-2">
            <p className="mb-1 text-truncate fw-bold">{show.name}</p>
            <div className="d-flex justify-content-between align-items-center">
              <span className="small text-light-emphasis">{show.theme}</span>
              <span className="badge bg-warning text-dark">
                ★ {show.rating?.average || "N/A"}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
