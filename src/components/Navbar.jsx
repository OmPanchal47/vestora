import { Link } from "react-router-dom";

export default function Navbar({ search, setSearch }) {
  return (
    <nav className="navbar navbar-dark bg-dark border-bottom border-secondary sticky-top px-3 py-2">
      <div className="d-flex align-items-center justify-content-between w-100">
        <div className="d-flex align-items-center gap-4">
          <div className="d-none d-lg-flex gap-4">
            <Link to="/" className="nav-link fw-bold text-light">BROWSE</Link>
            <Link to="/" className="nav-link text-secondary">TV SHOWS</Link>
          </div>
        </div>

        <Link to="/" className="navbar-brand fw-bold fs-4 text-light mb-0">
          VEST<span className="text-danger">ORA</span>
        </Link>

        <div className="d-flex align-items-center gap-3">
          <input
            type="text"
            className="form-control rounded-pill search-input"
            placeholder="Search shows..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
    </nav>
  );
}
