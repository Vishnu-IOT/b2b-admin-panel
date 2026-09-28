import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/text";
import "./enquiries.css";

export default function EnquiryCard({ enquiry }) {
  return (
    <div className="enquiry-card">
      <div className="enquiry-card__top">
        {enquiry.category && <span className="tag">{enquiry.category}</span>}
        <span className="enquiry-card__date">{formatDate(enquiry.createdAt)}</span>
      </div>
      <h4>{enquiry.title}</h4>
      <p className="enquiry-card__company">Shared by {enquiry.business.companyName}</p>
      <p className="enquiry-card__desc">{enquiry.description}</p>
      <div className="enquiry-card__facts">
        <div><span>Location</span><strong>{enquiry.location || "Not specified"}</strong></div>
      </div>
      <Link to={`/enquiries/${enquiry.id}`} className="btn btn-outline">View Details</Link>
    </div>
  );
}
