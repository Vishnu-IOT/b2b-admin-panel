import React, { useState } from "react";
import businessThoughts from "../../data/businessThoughts";
import "./thoughts.css";

export default function BusinessThoughts() {
  const [activeId, setActiveId] = useState(businessThoughts[0].id);
  const active = businessThoughts.find((t) => t.id === activeId);

  return (
    <section className="thoughts-section">
      <div className="container thoughts-grid">
        <div className="thoughts-list">
          <p className="eyebrow">Business Thoughts</p>
          <h2 className="section-heading" style={{ fontSize: "clamp(26px,3vw,36px)", marginBottom: 8 }}>
            Perspectives from the People Building
          </h2>
          <p className="section-sub" style={{ marginBottom: 28 }}>
            Founders and professionals share what they've actually learned — not polished advice.
          </p>
          {businessThoughts.map((t) => (
            <button
              key={t.id}
              className={`thoughts-list__item ${t.id === activeId ? "is-active" : ""}`}
              onClick={() => setActiveId(t.id)}
            >
              <span className="thoughts-list__author">{t.author}</span>
              <span className="thoughts-list__role">{t.role}</span>
            </button>
          ))}
        </div>
        <div className="thoughts-reader">
          <p className="thoughts-reader__quote">“{active.quote}”</p>
          <p className="thoughts-reader__body">{active.body}</p>
          <p className="thoughts-reader__attribution">— {active.author}, {active.role}</p>
        </div>
      </div>
    </section>
  );
}
