// =============================================================
// App.jsx — THE ROOT COMPONENT / THE ROUTER
// =============================================================
// WHY THIS FILE EXISTS:
// A normal website has multiple "pages" (home page, about page, product
// page...). In plain HTML, each page is a separate .html file and the
// browser loads a new file when you click a link.
//
// React apps usually work differently — it's a "Single Page App" (SPA).
// There's really only ONE html file (index.html). When you "navigate" to
// a different page, React just swaps out which COMPONENT is being shown,
// without actually reloading the browser. This is faster and smoother.
//
// react-router-dom is the library that manages this page-swapping.
// THIS is why we installed it (npm install react-router-dom) — without
// it, we would have no clean way to have a Home page AND a Product
// Details page in the same app with different URLs.
//
// HOW THE PIECES CONNECT:
// <BrowserRouter>  -> turns on the "URL-based navigation" system.
//                     It watches the browser's address bar.
// <Routes>         -> a container that holds all possible "paths".
// <Route path="/" element={<Home />} />
//                  -> says: "if the URL is exactly '/', show the
//                     Home component".
// <Route path="/product/:id" element={<ProductDetails />} />
//                  -> the ':id' part is a PLACEHOLDER. It matches ANY
//                     value in that position of the URL.
//                     Example: '/product/5' or '/product/42' both match,
//                     and inside ProductDetails.jsx we can read exactly
//                     which id the user asked for (useParams hook) and use
//                     it to fetch the right product from the API.
//                     This is EXACTLY what Stage 7 of your task needs:
//                     "Create a product details page using React Router
//                     and dynamic product IDs."

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home page: shows the full product listing + filters + sorting */}
        <Route path="/" element={<Home />} />

        {/* Product details page: ':id' is dynamic — React Router lets us
            read whatever value is actually in the URL at that spot */}
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
