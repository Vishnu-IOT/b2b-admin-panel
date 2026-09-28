import React from "react";
import { Link } from "react-router-dom";
import events from "../../data/events";
import EventCard from "./EventCard";
import "./events.css";

export function EventsFull() {
  return (
    <div className="events-full">
      <p className="eyebrow">Events</p>
      <h1 className="section-heading" style={{ fontSize: "clamp(30px,3.6vw,46px)", marginBottom: 40 }}>What's Happening</h1>
      <div className="events-grid">
        {events.map((e) => <EventCard event={e} key={e.id} />)}
      </div>
    </div>
  );
}

export default function EventsPreview() {
  return (
    <section className="events-section">
      <div className="container section-head-row">
        <div>
          <p className="eyebrow">Events</p>
          <h2 className="section-heading" style={{ fontSize: "clamp(28px,3.2vw,40px)" }}>What's Happening</h2>
        </div>
        <Link to="/events" className="btn-link">See all events →</Link>
      </div>
      <div className="container events-grid">
        {events.slice(0, 3).map((e) => <EventCard event={e} key={e.id} />)}
      </div>
    </section>
  );
}
