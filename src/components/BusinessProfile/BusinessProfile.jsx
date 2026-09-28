import React, { useState } from "react";
import { Link } from "react-router-dom";
import { fileUrl } from "../../api/client";
import { excerpt, formatDate } from "../../utils/text";
import "./profile.css";

const TABS = ["About", "Stories", "Strategies", "Achievements", "Products", "Enquiries", "Videos"];

export default function BusinessProfile({ business }) {
  const [tab, setTab] = useState("About");
  const counts = {
    Stories: business.stories?.length || 0,
    Strategies: business.strategies?.length || 0,
    Achievements: business.achievements?.length || 0,
    Products: business.products?.length || 0,
    Enquiries: business.enquiries?.length || 0,
    Videos: business.videos?.length || 0,
  };

  return (
    <div className="profile">
      <div className="profile-hero" style={{ background: business.coverImage ? undefined : "var(--color-ink)" }}>
        {business.coverImage && <img src={fileUrl(business.coverImage)} alt={business.companyName} />}
        <div className="profile-hero__overlay">
          <div className="container profile-hero__content">
            {business.logo && <img className="profile-hero__logo" src={fileUrl(business.logo)} alt={`${business.companyName} logo`} />}
            <div>
              <h1>{business.companyName}</h1>
              <p>{business.industry}{business.location ? ` · ${business.location}` : ""}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container profile-body">
        <div className="profile-tabs">
          {TABS.map((t) => (
            <button key={t} className={`profile-tab ${tab === t ? "is-active" : ""}`} onClick={() => setTab(t)}>
              {t}{counts[t] ? ` (${counts[t]})` : ""}
            </button>
          ))}
        </div>

        <div className="profile-content">
          {tab === "About" && (
            <div className="profile-about">
              {business.description && <p className="profile-tagline">{business.description}</p>}
              {business.story && (
                <>
                  <h4 className="profile-subhead">Our Story</h4>
                  <p className="profile-story-text">{business.story}</p>
                </>
              )}
              <div className="profile-facts">
                {business.website && <div><span>Website</span><a href={business.website} target="_blank" rel="noreferrer"><strong>{business.website}</strong></a></div>}
                {business.phone && <div><span>Phone</span><strong>{business.phone}</strong></div>}
                {business.email && <div><span>Email</span><strong>{business.email}</strong></div>}
              </div>
            </div>
          )}

          {tab === "Stories" && (
            <ListTab items={business.stories} empty="No stories published yet." render={(s) => (
              <Link to={`/stories/${s.id}`} key={s.id} className="profile-item">
                <h4>{s.title}</h4>
                <p>{excerpt(s.content, 140)}</p>
              </Link>
            )} />
          )}

          {tab === "Strategies" && (
            <ListTab items={business.strategies} empty="No strategies published yet." render={(s) => (
              <Link to={`/strategies/${s.id}`} key={s.id} className="profile-item">
                <h4>{s.title}</h4>
                <p>{excerpt(s.content, 140)}</p>
              </Link>
            )} />
          )}

          {tab === "Achievements" && (
            <ListTab items={business.achievements} empty="No achievements published yet." render={(a) => (
              <div key={a.id} className="profile-item">
                <h4>{a.title}</h4>
                {a.description && <p>{a.description}</p>}
                <span className="profile-item__meta">{a.awardedBy}{a.awardDate ? ` · ${formatDate(a.awardDate)}` : ""}</span>
              </div>
            )} />
          )}

          {tab === "Products" && (
            <ListTab items={business.products} empty="No products published yet." render={(p) => (
              <Link to={`/products/${p.slug}`} key={p.id} className="profile-item">
                <h4>{p.name}</h4>
                {p.description && <p>{p.description}</p>}
                <span className="profile-item__meta">Launch: {formatDate(p.launchDate)}</span>
              </Link>
            )} />
          )}

          {tab === "Enquiries" && (
            <ListTab items={business.enquiries} empty="No supplier enquiries posted yet." render={(e) => (
              <Link to={`/enquiries/${e.id}`} key={e.id} className="profile-item">
                <h4>{e.title}</h4>
                <p>{e.description}</p>
                <span className="profile-item__meta">{e.category}{e.location ? ` · ${e.location}` : ""}</span>
              </Link>
            )} />
          )}

          {tab === "Videos" && (
            <ListTab items={business.videos} empty="No videos published yet." render={(v) => (
              <Link to={`/videos/${v.id}`} key={v.id} className="profile-item">
                <h4>{v.title}</h4>
                {v.description && <p>{v.description}</p>}
              </Link>
            )} />
          )}
        </div>
      </div>
    </div>
  );
}

function ListTab({ items, empty, render }) {
  if (!items || !items.length) return <p className="section-sub">{empty}</p>;
  return <div className="profile-list">{items.map(render)}</div>;
}
