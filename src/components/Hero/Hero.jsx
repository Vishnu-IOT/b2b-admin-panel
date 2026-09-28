import React from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { storiesApi } from "../../api/endpoints";
import { fileUrl } from "../../api/client";
import { excerpt, readingTime } from "../../utils/text";
import { Loading, ErrorMessage } from "../common/StateMessage";
import "./hero.css";

export default function Hero() {
  const { data, loading, error, refetch } = useFetch(
    () => storiesApi.list({ limit: 4 }),
    [],
  );

  if (loading)
    return (
      <div className="hero">
        <Loading label="Loading the latest stories…" />
      </div>
    );
  if (error)
    return (
      <div className="hero container">
        <ErrorMessage error={error} onRetry={refetch} />
      </div>
    );

  const items = (data && data.items) || [];
  if (!items.length) {
    return (
      <section className="hero">
        <div className="container hero__empty">
          <p className="eyebrow">Business Stories</p>
          <h1 className="hero__headline">No stories published yet.</h1>
          <p className="hero__dek">
            Once a business shares its story, it will feature here.
          </p>
        </div>
      </section>
    );
  }

  const [featured, ...secondary] = items;

  return (
    <section className="hero">
      <div className="container hero__grid">
        <Link to={`/stories/${featured.id}`} className="hero__feature">
          <div className="hero__feature-image">
            {featured.coverImage ? (
              <img
                src={fileUrl(featured.coverImage)}
                alt={featured.business.companyName}
              />
            ) : (
              <div className="hero__feature-image--placeholder">
                {featured.business.companyName.charAt(0)}
              </div>
            )}
          </div>
          <div className="hero__feature-copy">
            <span className="eyebrow">Business Story</span>
            <h1 className="hero__headline">{featured.title}</h1>
            <p className="hero__dek">{excerpt(featured.content, 180)}</p>
            <div className="hero__byline">
              <span>{featured.business.companyName}</span>
              <span className="hero__dot">·</span>
              <span>{featured.business.industry}</span>
              <span className="hero__dot">·</span>
              <span>{readingTime(featured.content)}</span>
            </div>
          </div>
        </Link>

        <div className="hero__side">
          <p className="hero__side-label">More Business Stories</p>
          {secondary.slice(0, 3).map((s) => (
            <Link
              to={`/stories/${s.id}`}
              className="hero__side-item"
              key={s.id}
            >
              {s.coverImage && (
                <img src={fileUrl(s.coverImage)} alt={s.business.companyName} />
              )}
              <div>
                <span className="hero__side-category">
                  {s.business.industry || s.business.companyName}
                </span>
                <h4>{s.title}</h4>
              </div>
            </Link>
          ))}
          {secondary.length === 0 && (
            <p className="section-sub">
              More stories will appear here as businesses publish them.
            </p>
          )}
          <div className="hero__cta-row">
            <Link to="/stories" className="btn btn-primary">
              Explore Stories
            </Link>
            <Link to="/register" className="btn btn-outline">
              Join the Network
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
