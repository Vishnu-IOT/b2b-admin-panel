import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../components/Auth/AuthForm.css";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await register(form.name, form.email, form.password);
      navigate("/account");
    } catch (err) {
      setError(err.errors ? err.errors.map((x) => x.message).join(", ") : err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page-shell auth-page">
      <p className="eyebrow">Join the Network</p>
      <h1>Create Your Account</h1>
      <p className="section-sub">
        Join Vartha to ask questions, answer others, and be part of the business community.
      </p>
      {error && <div className="auth-form__error">{error}</div>}
      <form className="auth-form" onSubmit={onSubmit}>
        <input required placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input required type="password" placeholder="Password (min. 8 characters)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="btn btn-accent" disabled={busy} type="submit">{busy ? "Creating account…" : "Create Account"}</button>
      </form>
      <p className="auth-page__switch">Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  );
}
