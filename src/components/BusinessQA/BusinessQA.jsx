import React from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { questionsApi } from "../../api/endpoints";
import QuestionCard from "./QuestionCard";
import { Loading, ErrorMessage, Empty } from "../common/StateMessage";
import "./qa.css";

export function QuestionsFeed({ limit, category }) {
  const { data, loading, error, refetch } = useFetch(() => questionsApi.list({ limit: limit || 20, category }), [limit, category]);
  const items = (data && data.items) || [];
  if (loading) return <Loading />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;
  if (!items.length) return <Empty>No questions yet — be the first to ask.</Empty>;
  return (
    <div className="qa-list">
      {items.map((q) => <QuestionCard q={q} key={q.id} />)}
    </div>
  );
}

export default function BusinessQAPreview() {
  return (
    <section className="qa-section">
      <div className="container section-head-row">
        <div>
          <p className="eyebrow">Business Community</p>
          <h2 className="section-heading" style={{ fontSize: "clamp(26px,2.8vw,36px)" }}>Ask the Business Community</h2>
        </div>
        <Link to="/community" className="btn-link">Join the discussion →</Link>
      </div>
      <div className="container">
        <QuestionsFeed limit={3} />
      </div>
    </section>
  );
}
