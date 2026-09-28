import React from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { enquiriesApi } from "../../api/endpoints";
import EnquiryCard from "./EnquiryCard";
import { Loading, ErrorMessage, Empty } from "../common/StateMessage";
import "./enquiries.css";

export function EnquiriesFeed({ limit }) {
  const { data, loading, error, refetch } = useFetch(() => enquiriesApi.list({ limit: limit || 20 }), [limit]);
  const items = (data && data.items) || [];
  if (loading) return <Loading />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;
  if (!items.length) return <Empty>No supplier enquiries posted yet.</Empty>;
  return (
    <div className="enquiry-list">
      {items.map((e) => <EnquiryCard enquiry={e} key={e.id} />)}
    </div>
  );
}

export default function EnquiriesPreview() {
  return (
    <section className="enquiries-section">
      <div className="container section-head-row">
        <div>
          <p className="eyebrow">Supplier Enquiries</p>
          <h2 className="section-heading" style={{ fontSize: "clamp(26px,2.8vw,36px)" }}>What Businesses Are Looking For</h2>
          <p className="section-sub">Real requirements shared by businesses on the network.</p>
        </div>
        <Link to="/enquiries" className="btn-link">View all enquiries →</Link>
      </div>
      <div className="container">
        <EnquiriesFeed limit={3} />
      </div>
    </section>
  );
}
