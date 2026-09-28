import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { businessApi } from "../../api/endpoints";
import BusinessCard from "./BusinessCard";
import { Loading, ErrorMessage, Empty } from "../common/StateMessage";
import useFetch from "../../hooks/useFetch";
import "./directory.css";

export function BusinessDirectoryFull() {
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    businessApi
      .list({ q: query || undefined, industry: industry || undefined, location: location || undefined, page, limit: 12 })
      .then((res) => {
        setItems((prev) => (page === 1 ? res.items : [...prev, ...res.items]));
        setPagination(res.pagination);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [query, industry, location, page]);

  useEffect(() => setPage(1), [query, industry, location]);

  return (
    <div className="directory-full">
      <div className="directory-filters">
        <input type="text" placeholder="Search businesses…" value={query} onChange={(e) => setQuery(e.target.value)} />
        <input type="text" placeholder="Industry" value={industry} onChange={(e) => setIndustry(e.target.value)} />
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>
      {pagination && <p className="directory-count">{pagination.total} businesses found</p>}
      {loading && page === 1 && <Loading />}
      {error && <ErrorMessage error={error} onRetry={() => setPage(1)} />}
      {!loading && !error && items.length === 0 && <Empty>No businesses match those filters yet.</Empty>}
      <div className="directory-grid">
        {items.map((b) => <BusinessCard business={b} key={b.id} />)}
      </div>
      {pagination && page < pagination.totalPages && (
        <div className="directory-more">
          <button className="btn btn-outline" onClick={() => setPage((p) => p + 1)} disabled={loading}>
            {loading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function BusinessDirectoryPreview() {
  const { data, loading, error, refetch } = useFetch(() => businessApi.list({ limit: 6 }), []);
  const items = (data && data.items) || [];
  return (
    <section className="products-section" style={{ background: "var(--color-bg-soft)" }}>
      <div className="container section-head-row">
        <div>
          <p className="eyebrow">Business Discovery</p>
          <h2 className="section-heading" style={{ fontSize: "clamp(28px,3.2vw,40px)" }}>Discover Local Businesses</h2>
        </div>
        <Link to="/businesses" className="btn-link">View full directory →</Link>
      </div>
      <div className="container">
        {loading && <Loading />}
        {error && <ErrorMessage error={error} onRetry={refetch} />}
        {!loading && !error && !items.length && <Empty>No businesses published yet.</Empty>}
        {!loading && !error && items.length > 0 && (
          <div className="directory-grid directory-grid--preview">
            {items.map((b) => <BusinessCard business={b} key={b.id} />)}
          </div>
        )}
      </div>
    </section>
  );
}
