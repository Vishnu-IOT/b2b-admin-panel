import React from "react";
import { Link } from "react-router-dom";
import { fileUrl } from "../../api/client";
import { formatDate } from "../../utils/text";
import "./achievements.css";

export default function AchievementRow({ achievement }) {
  return (
    <Link to={`/achievements/${achievement.id}`} className="achv-row">
      {achievement.image ? (
        <img className="achv-row__image" src={fileUrl(achievement.image)} alt={achievement.title} />
      ) : (
        <div className="achv-row__image achv-row__image--placeholder">{achievement.business.companyName.charAt(0)}</div>
      )}
      <div className="achv-row__body">
        <span className="achv-row__company">{achievement.business.companyName}</span>
        <h4>{achievement.title}</h4>
        {achievement.description && <p>{achievement.description}</p>}
        <div className="achv-row__meta">
          {achievement.awardedBy && <span>Awarded by {achievement.awardedBy}</span>}
          {achievement.awardDate && <span>{formatDate(achievement.awardDate)}</span>}
        </div>
      </div>
    </Link>
  );
}
