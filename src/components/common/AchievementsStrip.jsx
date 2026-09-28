import React from "react";
import { achievements } from "../../data/achievements";
import "./common.css";

export default function AchievementsStrip() {
  return (
    <section className="achv-section">
      <div className="container">
        <div className="achv-head">
          <p className="eyebrow">Recognitions</p>
          <h2 className="section-heading" style={{ fontSize: "clamp(24px,2.6vw,32px)" }}>Achievements Worth Noting</h2>
        </div>
        <div className="achv-rows">
          {achievements.map((a) => (
            <div className="achv-row" key={a.id}>
              <span className="achv-row__company">{a.company}</span>
              <div className="achv-row__body">
                <h4>{a.title}</h4>
                <p>{a.description}</p>
              </div>
              <span className="achv-row__arrow">→</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
