import React from "react";
import { Link, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { strategiesApi } from "../api/endpoints";
import { fileUrl } from "../api/client";
import { excerpt, formatDate, readingTime } from "../utils/text";
import { useLanguage } from "../context/LanguageContext";
import { Loading, ErrorMessage } from "../components/common/StateMessage";
import { StrategiesGrid } from "../components/Strategies/Strategies";
import "../styles/article.css";

function StrategyDetail({ id }) {
  const { t } = useLanguage();
  const { data: strategy, loading, error, refetch } = useFetch(() => strategiesApi.getOne(id), [id]);
  if (loading) return <div className="page-shell container" style={{ paddingTop: 140 }}><Loading /></div>;
  if (error) return <div className="page-shell container" style={{ paddingTop: 140 }}><ErrorMessage error={error} onRetry={refetch} /></div>;
  if (!strategy) return null;

  const paragraphs = strategy.content
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article className="page-shell article">
      <div className="container article__head">
        <p className="eyebrow">{t("strategies.eyebrowDetail")} · {strategy.business.industry}</p>
        <h1 className="article__headline">{strategy.title}</h1>
        <p className="article__dek">{excerpt(strategy.content, 160)}</p>
        <div className="article__byline">
          <div className="article__author-avatar">{strategy.business.companyName.charAt(0)}</div>
          <div>
            <p className="article__author-name">{strategy.business.companyName}</p>
            <p className="article__author-meta">{readingTime(strategy.content)} · {formatDate(strategy.publishedAt || strategy.createdAt)}</p>
          </div>
        </div>
      </div>
      {strategy.coverImage && (
        <div className="article__hero-image"><img src={fileUrl(strategy.coverImage)} alt={strategy.business.companyName} /></div>
      )}
      <div className="container article__body">
        {paragraphs.length > 0 ? paragraphs.map((p, i) => <p key={i}>{p}</p>) : <p>{strategy.content}</p>}
        {/* <div className="article__footer-actions">
          <Link to={`/businesses/${strategy.business.slug}`} className="btn btn-outline">
            View {strategy.business.companyName}'s Profile
          </Link>
        </div> */}
      </div>
    </article>
  );
}

function StrategiesIndex() {
  const { t } = useLanguage();
  return (
    <div className="page-shell container" style={{ paddingTop: 40, paddingBottom: 90 }}>
      <p className="eyebrow">{t("strategies.eyebrow")}</p>
      <h1 className="section-heading" style={{ fontSize: "clamp(30px,3.6vw,46px)", marginBottom: 30 }}>{t("strategies.title")}</h1>
      <StrategiesGrid />
    </div>
  );
}

export default function StrategiesPage() {
  const { id } = useParams();
  return id ? <StrategyDetail id={id} /> : <StrategiesIndex />;
}
