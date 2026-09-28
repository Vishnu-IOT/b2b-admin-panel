import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { questionsApi } from "../../api/endpoints";
import "./qa.css";

export default function AskQuestionForm({ onCreated }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  if (!user) {
    return (
      <div className="qa-ask-cta">
        <p>Have a question for the business community?</p>
        <button className="btn btn-accent" onClick={() => navigate("/login", { state: { from: "/community" } })}>
          Log in to Ask
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="qa-ask-cta">
        <p>Have a question for the business community?</p>
        <button className="btn btn-accent" onClick={() => setOpen(true)}>Ask a Question</button>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await questionsApi.create(form);
      setForm({ title: "", description: "", category: "" });
      setOpen(false);
      if (onCreated) onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="qa-ask-form" onSubmit={submit}>
      {error && <div className="auth-form__error">{error}</div>}
      <input required placeholder="Your question" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <textarea required placeholder="Add some context…" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <input placeholder="Category (optional, e.g. Finance, Exporting)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
      <div className="qa-ask-form__actions">
        <button type="button" className="btn-link" onClick={() => setOpen(false)}>Cancel</button>
        <button className="btn btn-accent" disabled={busy} type="submit">{busy ? "Posting…" : "Post Question"}</button>
      </div>
    </form>
  );
}
