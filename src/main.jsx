// =============================================================
// main.jsx — THE ENTRY POINT OF THE ENTIRE APPLICATION
// =============================================================
// WHY THIS FILE EXISTS:
// A browser doesn't understand React on its own. It only understands
// plain HTML, CSS, and JavaScript. This file is the "bridge" that takes
// our React component (<App />) and injects it into the actual HTML page.
//
// HOW IT CONNECTS:
// - It looks at index.html, finds the empty <div id="root"></div>,
//   and tells React: "render my whole App inside this div."
// - Everything you see on screen eventually traces back to this file.
//
// WHY WE IMPORT BOOTSTRAP HERE:
// Bootstrap is just a big CSS file full of ready-made classes (btn, card,
// row, col, etc). Importing it here means it loads ONCE, globally, before
// anything else — so every component in the app can use Bootstrap classes
// without importing it again themselves.

import { createRoot } from "react-dom/client";

// Bootstrap's CSS file — gives us all the ready-made classes we use
// everywhere else (card, btn, badge, navbar, etc.)
import "bootstrap/dist/css/bootstrap.min.css";

// Our own small global styles (things Bootstrap doesn't cover)
import "./index.css";

// Styles specific to OUR components (filters sidebar, chips, etc.)
import "./App.css";

// The root component of our app — everything else lives inside this
import App from "./App.jsx";

// createRoot() + render() is React's way of saying:
// "take control of this one HTML element, and draw my component tree inside it"
createRoot(document.getElementById("root")).render(<App />);
