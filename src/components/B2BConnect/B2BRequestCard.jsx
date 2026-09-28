import React from "react";
import "./b2b.css";

export default function B2BRequestCard({ request }) {
  return (
    <div className="b2b-card">
      <div className="b2b-card__top">
        <span className="tag">{request.industry}</span>
        <span className="b2b-card__date">{request.postedOn}</span>
      </div>
      <h4>{request.requirement}</h4>
      <p className="b2b-card__company">Shared by {request.company}</p>
      <div className="b2b-card__facts">
        <div><span>Location</span><strong>{request.location}</strong></div>
        <div><span>Requirement</span><strong>{request.quantity}</strong></div>
      </div>
      <div className="b2b-card__actions">
        <button className="btn-link">Read More</button>
        <button className="btn btn-outline">Respond / Contact</button>
      </div>
    </div>
  );
}
