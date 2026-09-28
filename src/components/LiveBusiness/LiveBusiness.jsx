import React from "react";
import { Link } from "react-router-dom";
import liveSessions from "../../data/liveSessions";
import LiveSessionCard from "./LiveSessionCard";
import "./live.css";

function useByStatus(status) {
  return liveSessions.filter((s) => s.status === status);
}

export function LiveBusinessFull() {
  const live = useByStatus("live");
  const upcoming = useByStatus("upcoming");
  const past = useByStatus("past");
  return (
    <div className="live-full">
      <p className="eyebrow" style={{ color: "var(--color-accent-soft)" }}>Live Business</p>
      <h1 className="section-heading" style={{ color: "#F4EFE6", fontSize: "clamp(30px,3.6vw,46px)", marginBottom: 40 }}>
        Founder Talks, Lectures &amp; Live Sessions
      </h1>

      {live.length > 0 && (
        <div className="live-block">
          <h3>Live Now</h3>
          <div className="live-grid">{live.map((s) => <LiveSessionCard session={s} key={s.id} />)}</div>
        </div>
      )}
      <div className="live-block">
        <h3>Upcoming Live Sessions</h3>
        <div className="live-grid">{upcoming.map((s) => <LiveSessionCard session={s} key={s.id} />)}</div>
      </div>
      <div className="live-block">
        <h3>Watch Previous Sessions</h3>
        <div className="live-grid">{past.map((s) => <LiveSessionCard session={s} key={s.id} />)}</div>
      </div>
    </div>
  );
}

export default function LiveBusinessPreview() {
  const featured = liveSessions.find((s) => s.status === "live") || liveSessions[0];
  const others = liveSessions.filter((s) => s.id !== featured.id).slice(0, 2);
  return (
    <section className="live-section">
      <div className="container section-head-row">
        <div>
          <p className="eyebrow" style={{ color: "var(--color-accent-soft)" }}>Live Business</p>
          <h2 className="section-heading" style={{ color: "#F4EFE6", fontSize: "clamp(28px,3.2vw,40px)" }}>
            Watch. Learn. Ask Questions Live.
          </h2>
        </div>
        <Link to="/live" className="btn-link" style={{ color: "#F4EFE6", borderBottomColor: "var(--color-accent-soft)" }}>
          Explore Live Business →
        </Link>
      </div>
      <div className="container live-grid live-grid--preview">
        <LiveSessionCard session={featured} />
        {others.map((s) => <LiveSessionCard session={s} key={s.id} />)}
      </div>
    </section>
  );
}
