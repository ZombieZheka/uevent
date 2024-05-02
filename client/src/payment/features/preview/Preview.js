import React from "react";
import { Link, useParams } from "react-router-dom";

export const PreviewContainer = () => {
  let { type } = useParams();

  return (
    <main className="preview-page">
      <section className="cart">
        <h2>Cart</h2>
        <div className="cart-footer">
          <span className="cart-footer-label">Total:</span>
          <span className="cart-footer-amount">100.00</span>
          <Link to={`/checkout/${type}`}>
            <p className="button">Continue</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
