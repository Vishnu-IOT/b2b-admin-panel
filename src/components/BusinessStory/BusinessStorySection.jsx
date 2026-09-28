import React from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { storiesApi } from "../../api/endpoints";
import { fileUrl } from "../../api/client";
import { excerpt, formatDate } from "../../utils/text";
import { Loading, ErrorMessage, Empty } from "../common/StateMessage";
import "./stories.css";

export default function BusinessStorySection() {
  const { data, loading, error, refetch } = useFetch(() => storiesApi.list({ limit: 7 }), []);
  const items = (data && data.items) || [];
  // The hero already shows the newest story — start this feed from the second one.
  const [medium, ...rest] = items.slice(1);

  return (
    <section className="stories-section">
      <div className="container">
        <div className="section-head-row">
          <div>
            <p className="eyebrow">Business Media</p>
            <h2 className="section-heading" style={{ fontSize: "clamp(28px,3.2vw,40px)" }}>Latest Business Stories</h2>
          </div>
          <Link to="/stories" className="btn-link">View all stories →</Link>
        </div>

        {loading && <Loading />}
        {error && <ErrorMessage error={error} onRetry={refetch} />}
        {!loading && !error && !medium && <Empty>No further stories yet — check back soon.</Empty>}

        {!loading && !error && medium && (
          <div className="stories-grid">
            <Link to={`/stories/${medium.id}`} className="story-medium">
              {medium.coverImage && (
                <div className="story-medium__image">
                  <img src={fileUrl(medium.coverImage)} alt={medium.business.companyName} />
                </div>
              )}
              <div className="story-medium__body">
                <span className="tag">{medium.business.industry}</span>
                <h3>{medium.title}</h3>
                <p>{excerpt(medium.content, 150)}</p>
                <span className="btn-link">Read Story →</span>
              </div>
            </Link>

            <div className="stories-list">
              {rest.slice(0, 5).map((s) => (
                <Link to={`/stories/${s.id}`} className="story-list-row" key={s.id}>
                  <div>
                    <span className="story-list-row__meta">{s.business.companyName} · {formatDate(s.publishedAt || s.createdAt)}</span>
                    <h4>{s.title}</h4>
                  </div>
                  <span className="story-list-row__arrow">→</span>
                </Link>
              ))}
              {rest.length === 0 && <p className="section-sub">More stories will appear here soon.</p>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
