import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="page-shell container" style={{ paddingTop: 140, paddingBottom: 120, textAlign: "center" }}>
      <p className="eyebrow" style={{ justifyContent: "center" }}>404</p>
      <h1 className="section-heading" style={{ fontSize: "clamp(30px,4vw,50px)", margin: "16px 0 24px" }}>
        This page hasn't been built yet.
      </h1>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  );
}
