import React, { useState } from "react";

export default function JoinPage() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="page-shell container" style={{ paddingTop: 60, paddingBottom: 100, maxWidth: 620 }}>
      <p className="eyebrow">Join the Network</p>
      <h1 className="section-heading" style={{ fontSize: "clamp(28px,3.6vw,44px)", marginBottom: 16 }}>
        Bring Your Business to Vartha
      </h1>
      <p className="section-sub" style={{ marginBottom: 34, maxWidth: 560 }}>
        Create a living profile, post B2B requirements, share your story and connect with
        local businesses, suppliers and customers.
      </p>
      {submitted ? (
        <div style={{ padding: 24, background: "var(--color-accent-tint)", borderLeft: "3px solid var(--color-accent)" }}>
          Thanks for your interest — our team will reach out to help set up your business profile.
        </div>
      ) : (
        <form
          onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <input required placeholder="Business name" style={inputStyle} />
          <input required placeholder="Industry" style={inputStyle} />
          <input required placeholder="City / Location" style={inputStyle} />
          <input required type="email" placeholder="Contact email" style={inputStyle} />
          <button type="submit" className="btn btn-accent" style={{ marginTop: 8 }}>Request to Join</button>
        </form>
      )}
    </div>
  );
}

const inputStyle = {
  padding: "14px 16px",
  border: "1px solid var(--color-line)",
  background: "var(--color-bg-alt)",
  fontSize: 14,
  fontFamily: "inherit",
};
