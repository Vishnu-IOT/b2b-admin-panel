import React from "react";
import { Link } from "react-router-dom";
import { fileUrl } from "../../api/client";
import { formatDate } from "../../utils/text";
import "./products.css";

export default function ProductCard({ product }) {
  const upcoming = product.launchDate && new Date(product.launchDate) > new Date();
  return (
    <Link to={`/products/${product.slug}`} className="product-card">
      <div className="product-card__image">
        {product.image ? (
          <img src={fileUrl(product.image)} alt={product.name} />
        ) : (
          <div className="product-card__image--placeholder">{product.business.companyName.charAt(0)}</div>
        )}
        <span className="tag product-card__category">{upcoming ? "Upcoming" : "New Launch"}</span>
      </div>
      <div className="product-card__body">
        <p className="product-card__company">{product.business.companyName} · {product.business.location}</p>
        <h4>{product.name}</h4>
        {product.description && <p className="product-card__desc">{product.description}</p>}
        <div className="product-card__foot">
          <span className="product-card__date">{upcoming ? "Launching" : "Launched"} {formatDate(product.launchDate)}</span>
          <span className="btn-link">Read More</span>
        </div>
      </div>
    </Link>
  );
}
