import React from "react";
import { Link } from "react-router-dom";
import { fileUrl } from "../../api/client";
import "./resources.css";

export default function ResourceCard({ resource }) {
  const kind = resource.videoUrl ? "Video" : resource.filePath ? "Document" : "Article";
  return (
    <Link to={`/resources/${resource.slug}`} className="resource-card">
      <div className="resource-card__image">
        {resource.coverImage ? (
          <img src={fileUrl(resource.coverImage)} alt={resource.title} />
        ) : (
          <div className="resource-card__image--placeholder">{resource.category?.name?.charAt(0)}</div>
        )}
        <span className="tag resource-card__type">{kind}</span>
      </div>
      <div className="resource-card__body">
        <span className="resource-card__category">{resource.category?.name}</span>
        <h4>{resource.title}</h4>
        {resource.summary && <p>{resource.summary}</p>}
      </div>
    </Link>
  );
}
