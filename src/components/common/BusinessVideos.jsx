import React from "react";
import { businessVideos } from "../../data/todayTalks";
import "./common.css";

export default function BusinessVideos() {
  return (
    <section className="videos-section">
      <div className="container">
        <p className="eyebrow" style={{ color: "var(--color-accent-soft)" }}>Inside the Business</p>
        <h2 className="section-heading" style={{ color: "#F4EFE6", fontSize: "clamp(28px,3.2vw,40px)", marginBottom: 30 }}>
          Factory Tours, Interviews &amp; Demos
        </h2>
        <div className="videos-grid">
          {businessVideos.map((v) => (
            <div className="video-card" key={v.id}>
              <div className="video-card__thumb">
                <img src={v.image} alt={v.title} />
                <span className="video-card__play">▶</span>
                <span className="video-card__duration">{v.duration}</span>
              </div>
              <div className="video-card__body">
                <span className="tag" style={{ background: "rgba(124,151,172,0.1)", borderColor: "rgba(124,151,172,0.3)", color: "var(--color-accent-soft)" }}>{v.category}</span>
                <h4>{v.title}</h4>
                <p>{v.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
