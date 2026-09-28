import React from "react";
import { Link, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { achievementsApi } from "../api/endpoints";
import { fileUrl } from "../api/client";
import { excerpt, formatDate, readingTime } from "../utils/text";
import { useLanguage } from "../context/LanguageContext";
import { Loading, ErrorMessage } from "../components/common/StateMessage";
import { AchievementsFeed } from "../components/Achievements/Achievements";
import "../styles/article.css";

function RelatedStrip({ currentId, items }) {
  const { t } = useLanguage();
  const related = items.filter((a) => a.id !== currentId).slice(0, 3);
  if (!related.length) return null;
  return (
    <div className="related-strip">
      <p className="eyebrow">{t("achievements.related")}</p>
      <div className="related-strip__row">
        {related.map((a) => (
          <Link to={`/achievements/${a.id}`} key={a.id} className="related-strip__item">
            {a.image && <img src={fileUrl(a.image)} alt={a.business.companyName} />}
            <div>
              <span>{a.business.companyName}</span>
              <h4>{a.title}</h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function AchievementDetail({ id }) {
  const { t } = useLanguage();
  const { data: achievement, loading, error, refetch } = useFetch(() => achievementsApi.getOne(id), [id]);
  const { data: more } = useFetch(() => achievementsApi.list({ limit: 6 }), []);

  if (loading) return <div className="page-shell container" style={{ paddingTop: 140 }}><Loading /></div>;
  if (error) return <div className="page-shell container" style={{ paddingTop: 140 }}><ErrorMessage error={error} onRetry={refetch} /></div>;
  if (!achievement) return null;

  const bodyText = achievement.content || achievement.description || "";
  const paragraphs = bodyText
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article className="page-shell article">
      <div className="container article__head">
        <p className="eyebrow">
          {t("achievements.eyebrowDetail")}{achievement.business.industry ? ` · ${achievement.business.industry}` : ""}
        </p>
        <h1 className="article__headline">{achievement.title}</h1>
        {bodyText && <p className="article__dek">{excerpt(bodyText, 160)}</p>}
        <div className="article__byline">
          <div className="article__author-avatar">{achievement.business.companyName.charAt(0)}</div>
          <div>
            <p className="article__author-name">{achievement.business.companyName}</p>
            <p className="article__author-meta">
              {achievement.awardedBy ? `${t("achievements.awardedByPrefix")} ${achievement.awardedBy}` : readingTime(bodyText)}
              {" · "}
              {formatDate(achievement.awardDate || achievement.publishedAt || achievement.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {achievement.image && (
        <div className="article__hero-image">
          <img src={fileUrl(achievement.image)} alt={achievement.business.companyName} />
        </div>
      )}

      <div className="container article__body">
        {paragraphs.length > 0 ? (
          paragraphs.map((p, i) => <p key={i}>{p}</p>)
        ) : (
          <p>{bodyText}</p>
        )}
      </div>

      <div className="container">
        <RelatedStrip currentId={achievement.id} items={(more && more.items) || []} />
      </div>
    </article>
  );
}

function AchievementsIndex() {
  const { t } = useLanguage();
  return (
    <div className="page-shell container" style={{ paddingTop: 40, paddingBottom: 90 }}>
      <p className="eyebrow">{t("achievements.eyebrow")}</p>
      <h1 className="section-heading" style={{ fontSize: "clamp(30px,3.6vw,46px)", marginBottom: 30 }}>{t("achievements.title")}</h1>
      <AchievementsFeed />
    </div>
  );
}

export default function AchievementsPage() {
  const { id } = useParams();
  return id ? <AchievementDetail id={id} /> : <AchievementsIndex />;
}
