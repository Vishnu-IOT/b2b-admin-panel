import React from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { videosApi } from "../../api/endpoints";
import VideoCard from "./VideoCard";
import { Loading, ErrorMessage, Empty } from "../common/StateMessage";
import "./videos.css";

export function VideosGrid({ limit }) {
  const { data, loading, error, refetch } = useFetch(() => videosApi.list({ limit: limit || 20 }), [limit]);
  const items = (data && data.items) || [];
  if (loading) return <Loading />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;
  if (!items.length) return <Empty>No videos published yet.</Empty>;
  return (
    <div className="videos-grid">
      {items.map((v) => <VideoCard video={v} key={v.id} />)}
    </div>
  );
}

export default function VideosPreview() {
  return (
    <section className="videos-section">
      <div className="container section-head-row">
        <div>
          <p className="eyebrow">Business Videos</p>
          <h2 className="section-heading" style={{ fontSize: "clamp(26px,2.8vw,36px)" }}>Watch the Business</h2>
        </div>
        <Link to="/videos" className="btn-link">Browse all videos →</Link>
      </div>
      <div className="container">
        <VideosGrid limit={3} />
      </div>
    </section>
  );
}
