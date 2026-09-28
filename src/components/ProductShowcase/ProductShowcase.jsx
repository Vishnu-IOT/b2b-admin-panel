import React from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { productsApi } from "../../api/endpoints";
import ProductCard from "./ProductCard";
import { Loading, ErrorMessage, Empty } from "../common/StateMessage";
import "./products.css";

export default function ProductShowcase() {
  const { data, loading, error, refetch } = useFetch(() => productsApi.list({ limit: 8 }), []);
  const items = (data && data.items) || [];

  return (
    <section className="products-section">
      <div className="container section-head-row">
        <div>
          <p className="eyebrow">Product Discovery</p>
          <h2 className="section-heading" style={{ fontSize: "clamp(28px,3.2vw,40px)" }}>New Products</h2>
        </div>
        <Link to="/products" className="btn-link">Browse all products →</Link>
      </div>
      <div className="container">
        {loading && <Loading />}
        {error && <ErrorMessage error={error} onRetry={refetch} />}
        {!loading && !error && !items.length && <Empty>No products published yet.</Empty>}
        {!loading && !error && items.length > 0 && (
          <div className="scroll-row products-scroll">
            {items.map((p) => <ProductCard product={p} key={p.id} />)}
          </div>
        )}
      </div>
    </section>
  );
}
