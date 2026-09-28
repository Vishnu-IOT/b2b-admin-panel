import React from "react";
import "./events.css";

export default function EventCard({ event }) {
  const [day, month] = event.displayDate.split(", ")[1].split(" ");
  return (
    <div className="event-card">
      <div className="event-card__image">
        <img src={event.image} alt={event.title} />
        <div className="event-card__date-badge">
          <span>{day}</span>
          <span>{month}</span>
        </div>
      </div>
      <div className="event-card__body">
        <span className="tag">{event.type}</span>
        <h4>{event.title}</h4>
        <p>{event.description}</p>
        <div className="event-card__facts">
          <span>📍 {event.location}</span>
          <span>🕒 {event.time}</span>
        </div>
        <p className="event-card__organizer">By {event.organizer}</p>
        <button className="btn-link">Read More</button>
      </div>
    </div>
  );
}
