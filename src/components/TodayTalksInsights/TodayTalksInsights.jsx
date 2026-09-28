import React from "react";
import { todayTalksInsights } from "../../data/todayTalks";
import "./todaytalks.css";

export default function TodayTalksInsights() {
  return (
    <section className="tt-section">
      <div className="container tt-inner">
        <div className="tt-intro">
          <p className="eyebrow">In Partnership with Today Talks</p>
          <h2 className="section-heading" style={{ fontSize: "clamp(26px,3vw,36px)" }}>
            Business Insights from Today Talks
          </h2>
          <p className="section-sub">
            Vartha is connected with Today Talks, our local news platform — bringing you
            economic and policy context alongside business stories.
          </p>
          <button className="btn btn-outline">Visit Today Talks</button>
        </div>
        <div className="tt-list">
          {todayTalksInsights.map((item) => (
            <a className="tt-item" href="#top" key={item.id}>
              <img src={item.image} alt={item.title} />
              <div>
                <span className="tt-item__category">{item.category}</span>
                <h4>{item.title}</h4>
                <span className="tt-item__time">{item.time}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
