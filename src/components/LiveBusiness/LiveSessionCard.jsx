import React from "react";
import "./live.css";

export default function LiveSessionCard({ session }) {
  return (
    <div className={`live-card live-card--${session.status}`}>
      <div className="live-card__image">
        <img src={session.image} alt={session.title} />
        {session.status === "live" && <span className="live-card__badge live-card__badge--live">🔴 LIVE NOW</span>}
        {session.status === "upcoming" && <span className="live-card__badge">Upcoming</span>}
        {session.status === "past" && <span className="live-card__badge live-card__badge--past">Recorded</span>}
      </div>
      <div className="live-card__body">
        <span className="tag">{session.category}</span>
        <h4>{session.title}</h4>
        <p>{session.speaker}</p>
        <div className="live-card__foot">
          {session.status === "live" && <span>{session.viewers} watching</span>}
          {session.status === "upcoming" && <span>{session.scheduledFor}</span>}
          {session.status === "past" && <span>{session.watchedBy} views</span>}
          <button className="btn-link">
            {session.status === "live" ? "Watch Now" : session.status === "upcoming" ? "Set Reminder" : "Watch"}
          </button>
        </div>
      </div>
    </div>
  );
}
