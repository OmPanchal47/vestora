// =============================================================
// Navbar.jsx — THE TOP BAR (logo, nav links, search box, icons)
// =============================================================
// WHY THIS IS ITS OWN COMPONENT (instead of just being written
// directly inside Home.jsx):
// React is built around "components" — small, reusable, self-contained
// pieces of UI. The Navbar always looks and behaves the same no matter
// what page you're on, so pulling it into its own file means:
//   1. Home.jsx stays shorter and easier to read.
//   2. If we ever add more pages, we can reuse <Navbar /> on all of them
//      just by importing it again — no copy-pasting the same JSX.
//
// WHY IT RECEIVES "PROPS" (search, setSearch):
// This component does NOT own the search text itself. The ACTUAL state
// (the current search text) lives in Home.jsx (via useState). We just
// PASS IT DOWN into Navbar as a prop so it can display the current
// value and tell Home.jsx when the user types something new.
//
// This pattern is called "controlled input" + "lifting state up":
// - "Lifting state up" = keeping the real data in the PARENT component
//   (Home) instead of duplicating it inside the child (Navbar), so
//   there's only ONE source of truth.
// - search        = the current text value (read-only from Navbar's view)
// - setSearch      = a function Home.jsx passes down so Navbar CAN change
//   that value when the user types, without Navbar needing to know HOW
//   that happens internally.

import { Link } from "react-router-dom";
// Link works like a normal <a href="..."> tag, BUT it doesn't cause a
// full page reload. It just tells React Router to swap which page
// component is shown. Using <a> here would technically "work" but would
// reload the whole app every click, losing all React state — defeating
// the purpose of using React Router at all.

export default function Navbar({ search, setSearch }) {
  return (
    <nav className="navbar navbar-light bg-white border-bottom sticky-top px-3 py-2">
      {/* sticky-top = Bootstrap class that keeps this bar glued to the
          top of the screen even while the user scrolls down the page */}

      <div className="d-flex align-items-center justify-content-between w-100">
        <div className="d-flex align-items-center gap-4">
          {/* Hamburger menu icon — purely decorative here (no mobile
              slide-out menu wired up), matches the reference site's look */}
          <button className="btn border-0">☰</button>

          {/* d-none d-lg-flex = Bootstrap responsive classes.
              "d-none" hides this on small screens, "d-lg-flex" shows it
              as flex ONLY on large screens (lg breakpoint = 992px+).
              This is how we avoid the links overlapping the search box
              on tablet-sized screens. */}
          <div className="d-none d-lg-flex gap-4">
            <Link to="/" className="nav-link fw-bold text-primary">MEN</Link>
            <Link to="/" className="nav-link fw-bold text-dark">WOMEN</Link>
            <Link to="/" className="nav-link fw-bold text-dark">ACCESSORIES</Link>
          </div>
        </div>

        {/* Clicking the brand name takes you back to "/" (the home page) */}
        <Link to="/" className="navbar-brand fw-bold fs-4 text-primary mb-0">
          VEST<span className="text-dark">ORA</span>
        </Link>

        <div className="d-flex align-items-center gap-3">
          {/* THIS is the search input.
              value={search}          -> always shows whatever is currently
                                          stored in Home.jsx's "search" state
              onChange={...}          -> fires on EVERY keystroke. We grab
                                          e.target.value (the new text) and
                                          send it up to Home.jsx via setSearch.
              Because value is tied directly to state, and onChange is the
              ONLY way to update that state, this input is called a
              "controlled component" — React is always in control of what
              it displays, instead of the browser's default input behavior. */}
          <input
            type="text"
            className="form-control rounded-pill d-none d-sm-block search-input"
            placeholder="What are you looking for?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn border-0 fs-5">♡</button>
          <button className="btn border-0 fs-5">🛒</button>
        </div>
      </div>

      {/* Mobile-only version of the search bar — shown BELOW the main row
          only on extra-small screens (d-sm-none hides it once screen
          gets a bit bigger, where the inline one above takes over) */}
      <input
        type="text"
        className="form-control rounded-pill d-block d-sm-none mt-2"
        placeholder="What are you looking for?"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </nav>
  );
}
