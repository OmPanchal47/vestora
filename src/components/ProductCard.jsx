// =============================================================
// ProductCard.jsx — ONE reusable "tile" showing a single product
// =============================================================
// WHY THIS IS ITS OWN COMPONENT:
// The task explicitly says "reusable product cards." We will render
// potentially 30+ of these on the Home page (one per product). Instead
// of copy-pasting the same JSX 30 times with different data, we write
// the layout ONCE here and REUSE it by passing a different "product"
// object as a prop each time.
//
// HOW IT RECEIVES DATA:
// <ProductCard product={someProductObject} /> — "product" is a prop,
// basically a parameter being passed into this function component,
// exactly like passing an argument into a normal JS function.
//
// HOW THIS CONNECTS TO STAGE 7 (Product Details Page):
// Wrapping the whole card in <Link to={`/product/${product.id}`}>
// means clicking ANYWHERE on the card changes the URL to something
// like "/product/7". Our React Router setup in App.jsx matches that
// URL pattern (path="/product/:id") and shows the ProductDetails page,
// which will then read "7" out of the URL and fetch that one product.

import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="col-6 col-md-4 col-lg-3 mb-4">
      {/* Link wraps the entire card so the whole tile is clickable,
          not just a tiny "View" button. The template literal
          `/product/${product.id}` builds a URL string like
          "/product/7" using this specific product's real id. */}
      <Link
        to={`/product/${product.id}`}
        className="text-decoration-none text-dark"
      >
        <div className="card h-100 border-0">
          <div className="position-relative bg-light d-flex align-items-center justify-content-center product-img-wrap">
            {/* ♡ wishlist button — purely visual here, no functionality
                wired up (not part of this task's requirements) */}
            <button className="position-absolute top-0 end-0 m-2 btn btn-sm btn-light rounded-circle">
              ♡
            </button>
            <img
              src={product.image}
              alt={product.title}
              className="img-fluid"
              style={{ maxHeight: "85%" }}
            />
          </div>
          <div className="card-body px-1">
            <p className="text-muted text-uppercase small mb-1">
              {product.gender} {product.subCategory}
            </p>
            <p className="mb-1 text-truncate">{product.title}</p>
            <div className="d-flex justify-content-between align-items-center">
              <p className="fw-bold mb-0">₹{product.priceINR}</p>
              <span className="badge bg-success">★ {product.rating.rate}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
