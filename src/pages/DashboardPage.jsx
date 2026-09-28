import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import useFetch from "../hooks/useFetch";
import { businessApi } from "../api/endpoints";
import { Loading, ErrorMessage } from "../components/common/StateMessage";
import BusinessSetupForm from "../components/Dashboard/BusinessSetupForm";
import ContentManager from "../components/Dashboard/ContentManager";
import "../components/Dashboard/dashboard.css";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: business, loading, error, refetch } = useFetch(() => businessApi.getMine(), []);
  const [tab, setTab] = useState("stories");

  if (loading) return <div className="page-shell container" style={{ paddingTop: 140 }}><Loading /></div>;

  // No business profile yet — this happens for a brand-new BUSINESS_ADMIN account.
  const noProfileYet = error && error.status === 404;

  return (
    <div className="page-shell container dashboard" style={{ paddingTop: 50, paddingBottom: 90 }}>
      <p className="eyebrow">Dashboard</p>
      <h1 className="section-heading" style={{ fontSize: "clamp(26px,3.2vw,38px)", marginBottom: 6 }}>
        Welcome, {user.name}
      </h1>

      {error && !noProfileYet && <ErrorMessage error={error} onRetry={refetch} />}

      {noProfileYet || !business ? (
        <>
          <p className="section-sub" style={{ marginBottom: 26 }}>
            Set up your business profile to start publishing stories, products, and more.
          </p>
          <BusinessSetupForm onSaved={refetch} />
        </>
      ) : (
        <>
          <p className="section-sub" style={{ marginBottom: 30 }}>{business.companyName} · {business.industry}</p>

          <div className="dashboard-tabs">
            <button className={tab === "profile" ? "is-active" : ""} onClick={() => setTab("profile")}>Business Profile</button>
            {["stories", "strategies", "achievements", "products", "enquiries", "videos"].map((t) => (
              <button key={t} className={tab === t ? "is-active" : ""} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {tab === "profile" ? (
            <BusinessSetupForm business={business} onSaved={refetch} />
          ) : (
            <ContentManager type={tab} />
          )}
        </>
      )}
    </div>
  );
}
