import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import businesses from "../../data/businesses";
import products from "../../data/products";
import stories from "../../data/stories";
import events from "../../data/events";
import questions from "../../data/questions";
import "./search.css";

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const out = [];
    businesses.forEach((b) => {
      if (b.name.toLowerCase().includes(q) || b.industry.toLowerCase().includes(q)) {
        out.push({ type: "Business", label: b.name, sub: b.industry, path: `/businesses/${b.id}` });
      }
    });
    products.forEach((p) => {
      if (p.name.toLowerCase().includes(q)) {
        out.push({ type: "Product", label: p.name, sub: p.company, path: "/products" });
      }
    });
    stories.forEach((s) => {
      if (s.title.toLowerCase().includes(q)) {
        out.push({ type: "Story", label: s.title, sub: s.company, path: "/stories" });
      }
    });
    events.forEach((e) => {
      if (e.title.toLowerCase().includes(q)) {
        out.push({ type: "Event", label: e.title, sub: e.location, path: "/events" });
      }
    });
    questions.forEach((qs) => {
      if (qs.question.toLowerCase().includes(q)) {
        out.push({ type: "Question", label: qs.question, sub: qs.category, path: "/community" });
      }
    });
    return out.slice(0, 8);
  }, [query]);

  if (!open) return null;

  const go = (path) => {
    setQuery("");
    onClose();
    navigate(path);
  };

  return (
    <div className="search-overlay" role="dialog" aria-modal="true">
      <button className="search-overlay__backdrop" onClick={onClose} aria-label="Close search" />
      <div className="search-overlay__panel">
        <div className="search-overlay__input-row">
          <input
            autoFocus
            type="text"
            placeholder="Search businesses, products, stories, events, questions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="search-overlay__close" onClick={onClose}>Close</button>
        </div>
        <div className="search-overlay__results">
          {query && results.length === 0 && (
            <p className="search-overlay__empty">No results for “{query}” yet.</p>
          )}
          {results.map((r, i) => (
            <button key={i} className="search-overlay__result" onClick={() => go(r.path)}>
              <span className="tag">{r.type}</span>
              <span className="search-overlay__result-label">{r.label}</span>
              <span className="search-overlay__result-sub">{r.sub}</span>
            </button>
          ))}
          {!query && (
            <div className="search-overlay__suggestions">
              <p className="eyebrow">Try searching</p>
              <div className="search-overlay__chips">
                {["Textile", "Packaging", "GST", "Export", "Manufacturing"].map((s) => (
                  <button key={s} onClick={() => setQuery(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
