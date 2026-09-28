import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { questionsApi, answersApi } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/text";
import { Loading, ErrorMessage } from "../components/common/StateMessage";
import "../components/BusinessQA/qa.css";

function AnswerForm({ questionId, onPosted }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  if (!user) {
    return (
      <p className="section-sub">
        <button className="btn-link" onClick={() => navigate("/login", { state: { from: `/community/${questionId}` } })}>
          Log in
        </button>{" "}to answer this question.
      </p>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await answersApi.create({ questionId: Number(questionId), answer: text });
      setText("");
      onPosted();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="answer-form" onSubmit={submit}>
      {error && <div className="auth-form__error">{error}</div>}
      <textarea required rows={3} placeholder="Share your answer…" value={text} onChange={(e) => setText(e.target.value)} />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="btn btn-accent" disabled={busy} type="submit">{busy ? "Posting…" : "Post Answer"}</button>
      </div>
    </form>
  );
}

export default function QuestionDetailPage() {
  const { id } = useParams();
  const { data: question, loading, error, refetch } = useFetch(() => questionsApi.getOne(id), [id]);

  if (loading) return <div className="page-shell container" style={{ paddingTop: 140 }}><Loading /></div>;
  if (error) return <div className="page-shell container" style={{ paddingTop: 140 }}><ErrorMessage error={error} onRetry={refetch} /></div>;
  if (!question) return null;

  const answers = question.answers || [];

  return (
    <div className="page-shell container" style={{ paddingTop: 60, paddingBottom: 90, maxWidth: 760 }}>
      <Link to="/community" className="btn-link" style={{ marginBottom: 26, display: "inline-block" }}>← Back to Community</Link>
      <div className="qa-card__meta">
        {question.category && <span className="tag">{question.category}</span>}
        <span>{formatDate(question.createdAt)}</span>
      </div>
      <h1 className="section-heading" style={{ fontSize: "clamp(26px,3.4vw,38px)", margin: "14px 0" }}>{question.title}</h1>
      <p style={{ color: "var(--color-ink-soft)", lineHeight: 1.7, marginBottom: 10 }}>{question.description}</p>
      <p className="section-sub" style={{ marginBottom: 30 }}>Asked by {question.user.name}</p>

      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 10 }}>
        {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
      </h3>
      <div>
        {answers.map((a) => (
          <div className="answer-item" key={a.id}>
            <p className="answer-item__meta">{a.user.name} · {formatDate(a.createdAt)}</p>
            <p>{a.answer}</p>
          </div>
        ))}
        {answers.length === 0 && <p className="section-sub">No answers yet — be the first to help.</p>}
      </div>

      <AnswerForm questionId={id} onPosted={refetch} />
    </div>
  );
}
