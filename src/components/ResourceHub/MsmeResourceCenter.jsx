import React from "react";
import "./resources.css";

const msmeCards = [
  { title: "Udyam Registration", desc: "Register your business to access MSME benefits, subsidies and priority lending." },
  { title: "Government Schemes", desc: "CGTMSE, PMEGP, and state-level subsidy schemes for manufacturing and services." },
  { title: "GST Basics", desc: "Registration thresholds, filing frequency and input tax credit essentials." },
  { title: "Business Calculators", desc: "Working capital, GST and loan EMI calculators for quick estimates." },
  { title: "Funding Information", desc: "Term loans, working capital lines and government-backed credit guarantees." },
  { title: "Export Resources", desc: "IEC registration, export incentives and documentation checklists." },
];

export default function MsmeResourceCenter() {
  return (
    <section className="msme-section">
      <div className="container">
        <p className="eyebrow">Government &amp; MSME Support</p>
        <h2 className="section-heading" style={{ fontSize: "clamp(28px,3.2vw,40px)", marginBottom: 30 }}>
          MSME Resource Center
        </h2>
        <div className="msme-grid">
          {msmeCards.map((c) => (
            <div className="msme-card" key={c.title}>
              <h4>{c.title}</h4>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
        <div className="msme-disclaimer">
          <strong>Please note:</strong> Tax, legal and regulatory information on Vartha is provided for
          general guidance only. Always verify current rules with official government sources or a
          qualified professional before making business decisions.
        </div>
      </div>
    </section>
  );
}
