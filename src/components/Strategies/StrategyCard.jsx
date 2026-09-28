import React from "react";
import { Link } from "react-router-dom";
import { fileUrl } from "../../api/client";
import { excerpt, readingTime } from "../../utils/text";
import "./strategies.css";

export default function StrategyCard({ strategy }) {
  return (
    <Link to={`/strategies/${strategy.id}`} className="strategy-card">
      <div className="strategy-card__image">
        {strategy.coverImage ? (
          <img src={fileUrl(strategy.coverImage)} alt={strategy.title} />
        ) : (
          <div className="strategy-card__image--placeholder">{strategy.business.companyName.charAt(0)}</div>
        )}
      </div>
      <div className="strategy-card__body">
        <span className="tag">{strategy.business.industry}</span>
        <h4>{strategy.title}</h4>
        <p>{excerpt(strategy.content, 110)}</p>
        <span className="strategy-card__meta">{strategy.business.companyName} · {readingTime(strategy.content)}</span>
      </div>
    </Link>
  );
}
