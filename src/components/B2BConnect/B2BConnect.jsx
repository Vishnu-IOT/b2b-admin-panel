import React from "react";
import { Link } from "react-router-dom";
import b2bRequests from "../../data/b2bRequests";
import B2BRequestCard from "./B2BRequestCard";
import "./b2b.css";

export function B2BConnectFull() {
  return (
    <div className="b2b-full">
      <div className="b2b-full__head">
        <div>
          <p className="eyebrow">B2B Connect</p>
          <h1 className="section-heading" style={{ fontSize: "clamp(30px,3.6vw,46px)" }}>Find. Connect. Grow.</h1>
          <p className="section-sub" style={{ color: "#B7AF9C", marginTop: 12 }}>
            Real supplier and partner requirements, shared by businesses on the network.
          </p>
        </div>
        <button className="btn btn-accent">Share a Requirement</button>
      </div>
      <div className="b2b-list">
        {b2bRequests.map((r) => <B2BRequestCard request={r} key={r.id} />)}
      </div>
    </div>
  );
}

export default function B2BConnectPreview() {
  return (
    <section className="b2b-section">
      <div className="container section-head-row">
        <div>
          <p className="eyebrow">B2B Connect</p>
          <h2 className="section-heading" style={{ fontSize: "clamp(28px,3.2vw,40px)" }}>Find. Connect. Grow.</h2>
          <p className="section-sub">Live supplier and partner requirements from businesses across the network.</p>
        </div>
        <Link to="/b2b-connect" className="btn-link">View all requirements →</Link>
      </div>
      <div className="container b2b-list">
        {b2bRequests.slice(0, 3).map((r) => <B2BRequestCard request={r} key={r.id} />)}
      </div>
    </section>
  );
}
