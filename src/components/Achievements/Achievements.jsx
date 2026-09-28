import React from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { achievementsApi } from "../../api/endpoints";
import { useLanguage } from "../../context/LanguageContext";
import AchievementRow from "./AchievementRow";
import { Loading, ErrorMessage, Empty } from "../common/StateMessage";
import "./achievements.css";

export function AchievementsFeed({ limit }) {
  const { t } = useLanguage();
  const { data, loading, error, refetch } = useFetch(() => achievementsApi.list({ limit: limit || 20 }), [limit]);
  const items = (data && data.items) || [];

  if (loading) return <Loading />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;
  if (!items.length) return <Empty>{t("achievements.empty")}</Empty>;

  return (
    <div className="achv-rows">
      {items.map((a) => <AchievementRow achievement={a} key={a.id} />)}
    </div>
  );
}

export default function AchievementsPreview() {
  const { t } = useLanguage();
  return (
    <section className="achv-section">
      <div className="container">
        <div className="section-head-row">
          <div>
            <p className="eyebrow">{t("achievements.eyebrow")}</p>
            <h2 className="section-heading" style={{ fontSize: "clamp(26px,2.8vw,36px)" }}>{t("achievements.title")}</h2>
          </div>
          <Link to="/achievements" className="btn-link">{t("achievements.seeAll")}</Link>
        </div>
        <AchievementsFeed limit={4} />
      </div>
    </section>
  );
}
