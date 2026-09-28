import React from "react";
import pulseItems from "../../data/achievements";
import "./pulse.css";

export default function BusinessPulse() {
  const loop = [...pulseItems, ...pulseItems];
  return (
    <section className="pulse">
      <div className="container pulse__label-row">
        <span className="pulse__live-dot" />
        <span className="pulse__label">Business Pulse — live local activity</span>
      </div>
      <div className="pulse__track-wrap">
        <div className="pulse__track">
          {loop.map((item, i) => (
            <div className="pulse__item" key={i}>
              <span className="tag pulse__tag">{item.tag}</span>
              <span className="pulse__text">{item.text}</span>
              <span className="pulse__time">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
