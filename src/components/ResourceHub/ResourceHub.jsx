import React from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { resourcesApi } from "../../api/endpoints";
import ResourceCard from "./ResourceCard";
import { Loading, ErrorMessage, Empty } from "../common/StateMessage";
import "./resources.css";

export default function ResourceHubPreview() {
  const { data, loading, error, refetch } = useFetch(() => resourcesApi.list({ limit: 3 }), []);
  const items = (data && data.items) || [];
  return (
    <section className="resources-section">
      <div className="container section-head-row">
        <div>
          <p className="eyebrow">Knowledge Hub</p>
          <h2 className="section-heading" style={{ fontSize: "clamp(26px,2.8vw,36px)" }}>Resources for Local Business</h2>
        </div>
        <Link to="/resources" className="btn-link">Explore all resources →</Link>
      </div>
      <div className="container">
        {loading && <Loading />}
        {error && <ErrorMessage error={error} onRetry={refetch} />}
        {!loading && !error && !items.length && <Empty>No resources published yet.</Empty>}
        {!loading && !error && items.length > 0 && (
          <div className="resources-grid">
            {items.map((r) => <ResourceCard resource={r} key={r.id} />)}
          </div>
        )}
      </div>
    </section>
  );
}
