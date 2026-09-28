import React from "react";
import founders from "../../data/founders";
import "./founders.css";

export default function FounderStories() {
  return (
    <section className="founders-section">
      <div className="container">
        <p className="eyebrow">People</p>
        <h2 className="section-heading" style={{ fontSize: "clamp(28px,3.2vw,40px)", marginBottom: 30 }}>
          Meet the People Behind the Business
        </h2>
        <div className="founders-grid">
          {founders.map((f) => (
            <div className="founder-card" key={f.id}>
              <img src={f.image} alt={f.name} />
              <div className="founder-card__body">
                <p className="founder-card__quote">“{f.quote}”</p>
                <p className="founder-card__name">{f.name}</p>
                <p className="founder-card__meta">{f.company} · {f.industry}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
