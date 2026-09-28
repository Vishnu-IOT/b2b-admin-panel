import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/text";
import "./qa.css";

export default function QuestionCard({ q }) {
  return (
    <Link to={`/community/${q.id}`} className="qa-card">
      <div className="qa-card__body">
        <div className="qa-card__meta">
          {q.category && <span className="tag">{q.category}</span>}
          <span>{formatDate(q.createdAt)}</span>
        </div>
        <h4>{q.title}</h4>
        <p>{q.description}</p>
        <div className="qa-card__foot">
          <span>Asked by {q.user.name}</span>
          <span>{q.answerCount} {q.answerCount === 1 ? "answer" : "answers"}</span>
        </div>
      </div>
    </Link>
  );
}
