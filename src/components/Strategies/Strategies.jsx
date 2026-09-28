import React from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { strategiesApi } from "../../api/endpoints";
import StrategyCard from "./StrategyCard";
import { Loading, ErrorMessage, Empty } from "../common/StateMessage";
import "./strategies.css";

export function StrategiesGrid({ limit }) {
  const { data, loading, error, refetch } = useFetch(() => strategiesApi.list({ limit: limit || 20 }), [limit]);
  const items = (data && data.items) || [];
  if (loading) return <Loading />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;
  if (!items.length) return <Empty>No strategies published yet.</Empty>;
  return (
    <div className="strategies-grid">
      {items.map((s) => <StrategyCard strategy={s} key={s.id} />)}
    </div>
  );
}

export default function StrategiesPreview() {
  const { data, loading, error, refetch } = useFetch(() => strategiesApi.list({ limit: 6 }), []);
  const items = (data && data.items) || [];
  return (
    <section className="strategies-section">
      <div className="container section-head-row">
        <div>
          <p className="eyebrow">Strategies &amp; Insights</p>
          <h2 className="section-heading" style={{ fontSize: "clamp(26px,2.8vw,36px)" }}>What Worked for Them</h2>
        </div>
        <Link to="/strategies" className="btn-link">More strategies →</Link>
      </div>
      <div className="container">
        {loading && <Loading />}
        {error && <ErrorMessage error={error} onRetry={refetch} />}
        {!loading && !error && !items.length && <Empty>No strategies published yet.</Empty>}
        {!loading && !error && items.length > 0 && (
          <div className="scroll-row strategies-scroll">
            {items.map((s) => <StrategyCard strategy={s} key={s.id} />)}
          </div>
        )}
      </div>
    </section>
  );
}
