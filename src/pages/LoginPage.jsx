import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../components/Auth/AuthForm.css";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(form.email, form.password);
      navigate(location.state?.from || "/account");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page-shell auth-page">
      <p className="eyebrow">Welcome back</p>
      <h1>Log in to Vartha</h1>
      <p className="section-sub">Log in to ask questions, answer others, and join the discussion.</p>
      {error && <div className="auth-form__error">{error}</div>}
      <form className="auth-form" onSubmit={onSubmit}>
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn btn-accent" disabled={busy} type="submit">{busy ? "Logging in…" : "Log in"}</button>
      </form>
      <p className="auth-page__switch">New here? <Link to="/register">Create a business account</Link></p>
    </div>
  );
}
