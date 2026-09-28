import React from "react";
import { Link, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { storiesApi } from "../api/endpoints";
import { fileUrl } from "../api/client";
import { excerpt, formatDate, readingTime } from "../utils/text";
import { useLanguage } from "../context/LanguageContext";
import { Loading, ErrorMessage, Empty } from "../components/common/StateMessage";
import "../styles/article.css";

function RelatedStrip({ currentId, items }) {
  const { t } = useLanguage();
  const related = items.filter((s) => s.id !== currentId).slice(0, 3);
  if (!related.length) return null;
  return (
    <div className="related-strip">
      <p className="eyebrow">{t("stories.readNext")}</p>
      <div className="related-strip__row">
        {related.map((s) => (
          <Link to={`/stories/${s.id}`} key={s.id} className="related-strip__item">
            {s.coverImage && <img src={fileUrl(s.coverImage)} alt={s.business.companyName} />}
            <div>
              <span>{s.business.industry}</span>
              <h4>{s.title}</h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StoryDetail({ id }) {
  const { data: story, loading, error, refetch } = useFetch(() => storiesApi.getOne(id), [id]);
  const { data: more } = useFetch(() => storiesApi.list({ limit: 6 }), []);

  if (loading) return <div className="page-shell container" style={{ paddingTop: 140 }}><Loading /></div>;
  if (error) return <div className="page-shell container" style={{ paddingTop: 140 }}><ErrorMessage error={error} onRetry={refetch} /></div>;
  if (!story) return null;

  const paragraphs = story.content
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article className="page-shell article">
      <div className="container article__head">
        <p className="eyebrow">{story.business.industry} · {story.business.location}</p>
        <h1 className="article__headline">{story.title}</h1>
        <p className="article__dek">{excerpt(story.content, 160)}</p>
        <div className="article__byline">
          <div className="article__author-avatar">{story.business.companyName.charAt(0)}</div>
          <div>
            <p className="article__author-name">{story.business.companyName}</p>
            <p className="article__author-meta">{readingTime(story.content)} · {formatDate(story.publishedAt || story.createdAt)}</p>
          </div>
        </div>
      </div>

      {story.coverImage && (
        <div className="article__hero-image">
          <img src={fileUrl(story.coverImage)} alt={story.business.companyName} />
        </div>
      )}

      <div className="container article__body">
        {paragraphs.length > 0 ? (
          paragraphs.map((p, i) => <p key={i}>{p}</p>)
        ) : (
          <p>{story.content}</p>
        )}
        {/* <div className="article__footer-actions">
          <Link to={`/businesses/${story.business.slug}`} className="btn btn-outline">
            View {story.business.companyName}'s Profile
          </Link>
        </div> */}
      </div>

      <div className="container">
        <RelatedStrip currentId={story.id} items={(more && more.items) || []} />
      </div>
    </article>
  );
}

function StoriesIndex() {
  const { t } = useLanguage();
  const { data, loading, error, refetch } = useFetch(() => storiesApi.list({ limit: 24 }), []);
  const items = (data && data.items) || [];
  return (
    <div className="page-shell container" style={{ paddingTop: 40, paddingBottom: 90 }}>
      <p className="eyebrow">{t("stories.eyebrow")}</p>
      <h1 className="section-heading" style={{ fontSize: "clamp(30px,3.6vw,46px)", marginBottom: 30 }}>{t("stories.title")}</h1>
      {loading && <Loading />}
      {error && <ErrorMessage error={error} onRetry={refetch} />}
      {!loading && !error && !items.length && <Empty>{t("stories.empty")}</Empty>}
      <div className="stories-index-grid">
        {items.map((s) => (
          <Link to={`/stories/${s.id}`} key={s.id} className="stories-index-card">
            {s.coverImage ? (
              <img src={fileUrl(s.coverImage)} alt={s.business.companyName} />
            ) : (
              <div className="stories-index-card__placeholder">{s.business.companyName.charAt(0)}</div>
            )}
            <div>
              <p className="eyebrow" style={{ marginBottom: 10 }}>{s.business.industry}</p>
              <h4>{s.title}</h4>
              <p className="stories-index-card__meta">{s.business.companyName} · {readingTime(s.content)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function StoriesPage() {
  const { id } = useParams();
  return id ? <StoryDetail id={id} /> : <StoriesIndex />;
}
