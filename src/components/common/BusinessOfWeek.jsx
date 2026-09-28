import React from "react";
import { businessOfTheWeek as b } from "../../data/todayTalks";
import "./common.css";

export default function BusinessOfWeek() {
  return (
    <section className="botw-section">
      <div className="container botw-grid">
        <div className="botw-image">
          <img src={b.image} alt={b.company} />
        </div>
        <div className="botw-body">
          <p className="eyebrow">Business of the Week</p>
          <h2 className="section-heading" style={{ fontSize: "clamp(28px,3.2vw,42px)" }}>{b.company}</h2>
          <p className="botw-meta">{b.industry} · {b.location} · Founded by {b.founder}</p>
          <p className="botw-story">{b.story}</p>
          <div className="botw-facts">
            <div>
              <span>Products</span>
              <strong>{b.products.join(", ")}</strong>
            </div>
            <div>
              <span>Achievement</span>
              <strong>{b.achievement}</strong>
            </div>
          </div>
          <div className="hero__actions">
            <button className="btn btn-primary">Read Full Story</button>
            <button className="btn btn-outline">Watch Interview</button>
          </div>
        </div>
      </div>
    </section>
  );
}
