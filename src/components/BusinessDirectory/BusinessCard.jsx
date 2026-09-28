import React from "react";
import { Link } from "react-router-dom";
import { fileUrl } from "../../api/client";
import "./directory.css";

export default function BusinessCard({ business }) {
  return (
    <Link to={`/businesses/${business.slug}`} className="business-card">
      <div className="business-card__image">
        {business.coverImage ? (
          <img src={fileUrl(business.coverImage)} alt={business.companyName} />
        ) : (
          <div className="business-card__image--placeholder">{business.companyName.charAt(0)}</div>
        )}
      </div>
      <div className="business-card__body">
        <div className="business-card__meta">
          {business.industry && <span className="tag">{business.industry}</span>}
          <span className="business-card__location">{business.location}</span>
        </div>
        <h4>{business.companyName}</h4>
        {business.description && <p>{business.description}</p>}
      </div>
    </Link>
  );
}
