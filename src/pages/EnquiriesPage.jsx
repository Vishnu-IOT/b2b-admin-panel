import React from "react";
import { Link, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { enquiriesApi } from "../api/endpoints";
import { formatDate } from "../utils/text";
import { Loading, ErrorMessage } from "../components/common/StateMessage";
import { EnquiriesFeed } from "../components/Enquiries/Enquiries";
import "../styles/article.css";

function EnquiryDetail({ id }) {
  const { data: enquiry, loading, error, refetch } = useFetch(() => enquiriesApi.getOne(id), [id]);
  if (loading) return <div className="page-shell container" style={{ paddingTop: 140 }}><Loading /></div>;
  if (error) return <div className="page-shell container" style={{ paddingTop: 140 }}><ErrorMessage error={error} onRetry={refetch} /></div>;
  if (!enquiry) return null;

  return (
    <article className="page-shell article">
      <div className="container article__head">
        <p className="eyebrow">Supplier Enquiry {enquiry.category ? `· ${enquiry.category}` : ""}</p>
        <h1 className="article__headline">{enquiry.title}</h1>
        <div className="article__byline">
          <div className="article__author-avatar">{enquiry.business.companyName.charAt(0)}</div>
          <div>
            <p className="article__author-name">{enquiry.business.companyName}</p>
            <p className="article__author-meta">{enquiry.location || "Location not specified"} · Posted {formatDate(enquiry.createdAt)}</p>
          </div>
        </div>
      </div>
      <div className="container article__body">
        <p>{enquiry.description}</p>
        {enquiry.contactInfo && (
          <blockquote className="article__pullquote" style={{ fontSize: 18 }}>
            Contact: {enquiry.contactInfo}
          </blockquote>
        )}
        {/* <div className="article__footer-actions">
          <Link to={`/businesses/${enquiry.business.slug}`} className="btn btn-outline">
            View {enquiry.business.companyName}'s Profile
          </Link>
        </div> */}
      </div>
    </article>
  );
}

function EnquiriesIndex() {
  return (
    <div className="page-shell container" style={{ paddingTop: 40, paddingBottom: 90 }}>
      <p className="eyebrow">Supplier Enquiries</p>
      <h1 className="section-heading" style={{ fontSize: "clamp(30px,3.6vw,46px)", marginBottom: 12 }}>What Businesses Are Looking For</h1>
      <p className="section-sub" style={{ marginBottom: 30 }}>
        Real requirements shared by businesses on the network — read the details and reach out directly.
      </p>
      <EnquiriesFeed />
    </div>
  );
}

export default function EnquiriesPage() {
  const { id } = useParams();
  return id ? <EnquiryDetail id={id} /> : <EnquiriesIndex />;
}
