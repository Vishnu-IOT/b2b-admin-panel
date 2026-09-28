import React from "react";
import { Link, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { videosApi } from "../api/endpoints";
import { fileUrl } from "../api/client";
import { youtubeEmbedUrl } from "../utils/text";
import { Loading, ErrorMessage } from "../components/common/StateMessage";
import { VideosGrid } from "../components/Videos/Videos";
import "../styles/article.css";

function VideoDetail({ id }) {
  const { data: video, loading, error, refetch } = useFetch(() => videosApi.getOne(id), [id]);
  if (loading) return <div className="page-shell container" style={{ paddingTop: 140 }}><Loading /></div>;
  if (error) return <div className="page-shell container" style={{ paddingTop: 140 }}><ErrorMessage error={error} onRetry={refetch} /></div>;
  if (!video) return null;

  const embed = video.type === "YOUTUBE" ? youtubeEmbedUrl(video.youtubeUrl) : null;

  return (
    <article className="page-shell article">
      <div className="container article__head">
        <p className="eyebrow">Business Video · {video.business.industry}</p>
        <h1 className="article__headline">{video.title}</h1>
        <div className="article__byline">
          <div className="article__author-avatar">{video.business.companyName.charAt(0)}</div>
          <div><p className="article__author-name">{video.business.companyName}</p></div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 900, margin: "0 auto 34px" }}>
        {embed ? (
          <div style={{ position: "relative", paddingTop: "56.25%", background: "#000" }}>
            <iframe
              src={embed}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
            />
          </div>
        ) : video.videoPath ? (
          <video src={fileUrl(video.videoPath)} controls style={{ width: "100%", background: "#000" }} />
        ) : (
          <p className="section-sub">Video unavailable.</p>
        )}
      </div>

      <div className="container article__body">
        {video.description && <p>{video.description}</p>}
        {/* <div className="article__footer-actions">
          <Link to={`/businesses/${video.business.slug}`} className="btn btn-outline">
            View {video.business.companyName}'s Profile
          </Link>
        </div> */}
      </div>
    </article>
  );
}

function VideosIndex() {
  return (
    <div className="page-shell container" style={{ paddingTop: 40, paddingBottom: 90 }}>
      <p className="eyebrow">Business Videos</p>
      <h1 className="section-heading" style={{ fontSize: "clamp(30px,3.6vw,46px)", marginBottom: 30 }}>Watch the Business</h1>
      <VideosGrid />
    </div>
  );
}

export default function VideosPage() {
  const { id } = useParams();
  return id ? <VideoDetail id={id} /> : <VideosIndex />;
}
