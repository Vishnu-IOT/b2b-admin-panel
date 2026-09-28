import React from "react";
import { useAuth } from "../context/AuthContext";
import "./AccountPage.css";

export default function AccountPage() {
  const { user, logout } = useAuth();

  return (
    <div className="page-shell container account-page">
      <p className="eyebrow">Your Account</p>
      <h1 className="section-heading" style={{ fontSize: "clamp(26px,3.2vw,38px)", marginBottom: 30 }}>
        {user.name}
      </h1>

      <div className="account-card">
        <div className="account-row">
          <span>Name</span>
          <strong>{user.name}</strong>
        </div>
        <div className="account-row">
          <span>Email</span>
          <strong>{user.email}</strong>
        </div>
        <div className="account-row">
          <span>Account Type</span>
          <strong>{user.role === "BUSINESS_ADMIN" ? "Business Account" : user.role}</strong>
        </div>
      </div>

      <button className="btn btn-outline" style={{ marginTop: 28 }} onClick={logout}>
        Log out
      </button>
    </div>
  );
}
