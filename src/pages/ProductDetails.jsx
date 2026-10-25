// =============================================================
// ProductDetails.jsx — THE PRODUCT DETAILS PAGE (Stage 7)
// =============================================================
// WHY THIS PAGE NEEDS useParams():
// Remember in App.jsx we defined: <Route path="/product/:id" ... />
// The ":id" part is a PLACEHOLDER in the URL pattern. When the user is
// actually on a URL like "/product/7", React Router knows "id" = "7"
// for THIS specific page view. But how do we, inside this component,
// actually READ that "7"?
//
// That's exactly what the useParams() hook does. It looks at whatever
// page you're currently on and returns an object with every placeholder
// value filled in. For "/product/7", useParams() returns { id: "7" }.
//
// WHY WE FETCH AGAIN HERE (instead of reusing Home.jsx's product list):
// The task specifically says: "fetching individual product data from
// the API" — meaning THIS page should do its own, separate fetch for
// just ONE product, not just dig through data that happened to already
// be loaded elsewhere. This also means this page works correctly even
// if the user pastes a product URL directly into the address bar
// without ever visiting the Home page first (where Home's product list
// wouldn't exist yet).

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { enrichProduct } from "../utils/productMeta";

export default function ProductDetails() {
  // Pulls the dynamic part of the URL out. If the URL is
  // "/product/7", then id === "7" (note: it comes through as a STRING,
  // even though product ids are numbers in our data — this matters
  // below when we build the fetch URL).
  const { id } = useParams();

  const [product, setProduct] = useState(null); // null = not loaded yet
  const [loading, setLoading] = useState(true);

  // WHY [id] IS IN THE DEPENDENCY ARRAY THIS TIME (unlike Home.jsx's []):
  // In Home.jsx, useEffect ran ONCE and never again, because the
  // product LIST never needs to be refetched after it first loads.
  // Here, if the user clicks from one product details page straight to
  // a DIFFERENT product (id changes, but the component itself doesn't
  // get thrown away and recreated — React Router can reuse it), we need
  // this effect to run AGAIN with the new id. Putting "id" in the
  // dependency array tells React: "re-run this effect whenever id
  // changes," which keeps the page correct no matter how the user gets
  // here.
  useEffect(() => {
    setLoading(true);
    // fetch a SINGLE product by id — FakeStoreAPI supports this
    // directly by just appending the id to the URL path.
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(enrichProduct(data));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [id]);

  // ---- Guard clauses: handle the "not ready yet" states FIRST ----
  // This avoids errors like "Cannot read property 'title' of null"
  // that would happen if we tried to render product.title before
  // product actually exists.
  if (loading) {
    return (
      <>
        <Navbar search="" setSearch={() => {}} />
        <p className="text-center mt-5">Loading product...</p>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar search="" setSearch={() => {}} />
        <p className="text-center mt-5">Product not found.</p>
      </>
    );
  }

  // ---- Only reached once "product" is guaranteed to be real data ----
  return (
    <>
      <Navbar search="" setSearch={() => {}} />
      <div className="page-wrap">
        {/* Link back to the home page, so the user isn't stuck here */}
        <Link to="/" className="d-inline-block mb-3 text-decoration-none">
          ← Back to shop
        </Link>

        <div className="row">
          <div className="col-md-5">
            <div className="bg-light d-flex align-items-center justify-content-center p-4">
              <img src={product.image} alt={product.title} className="img-fluid" style={{ maxHeight: "400px" }} />
            </div>
          </div>
          <div className="col-md-7">
            <p className="text-muted text-uppercase small mb-1">
              {product.gender} {product.subCategory}
            </p>
            <h3>{product.title}</h3>
            <p className="fs-4 fw-bold">₹{product.priceINR}</p>
            <span className="badge bg-success mb-3">★ {product.rating.rate} ({product.rating.count} reviews)</span>

            <p className="mt-3">{product.description}</p>

            <div className="mb-2">
              <strong>Theme:</strong> {product.theme}
            </div>
            <div className="mb-2">
              <strong>Pattern:</strong> {product.pattern}
            </div>
            <div className="mb-2">
              <strong>Collection:</strong> {product.collection}
            </div>
            <div className="mb-2">
              <strong>Color:</strong> {product.color.name}
            </div>
            <div className="mb-3">
              <strong>Available sizes:</strong> {product.sizes.join(", ")}
            </div>

            <button className="btn btn-dark px-4">Add to Cart</button>
          </div>
        </div>
      </div>
    </>
  );
}
