import React from "react";
import useScrollReveal from "../../hooks/useScrollReveal";
import "./journey.css";

const journey = [
  { year: "2018", label: "Started with ₹1 Lakh", detail: "One knitting machine, a rented shed, and three employees." },
  { year: "2020", label: "First Major Customer", detail: "A domestic retail chain placed its first bulk order." },
  { year: "2022", label: "Expanded Production", detail: "Opened a second unit to meet growing demand." },
  { year: "2024", label: "Entered New Market", detail: "First export shipment left for the European market." },
  { year: "2026", label: "₹10 Crore Business", detail: "Three units, 200+ employees, and a regional brand name." },
];

export default function BusinessJourney() {
  const containerRef = useScrollReveal();
  return (
    <section className="journey-section" ref={containerRef}>
      <div className="container">
        <div className="journey-head">
          <p className="eyebrow">Signature Series</p>
          <h2 className="section-heading" style={{ fontSize: "clamp(30px,3.6vw,46px)" }}>
            From ₹1 Lakh<br />to ₹1 Crore — and Beyond
          </h2>
          <p className="section-sub">
            Real growth journeys of businesses on Vartha, told year by year.
            This one traces Sundar Textiles, from a single machine to a regional export brand.
          </p>
        </div>

        <div className="journey-timeline">
          <div className="journey-timeline__line" />
          {journey.map((step, i) => (
            <div className="journey-step reveal" key={step.year} style={{ transitionDelay: `${i * 90}ms` }}>
              <div className="journey-step__dot" />
              <span className="journey-step__year">{step.year}</span>
              <h4>{step.label}</h4>
              <p>{step.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
