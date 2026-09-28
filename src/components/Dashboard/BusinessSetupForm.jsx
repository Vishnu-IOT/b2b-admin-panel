import React, { useState } from "react";
import { businessApi } from "../../api/endpoints";
import "./dashboard.css";

const FIELDS = [
  { name: "companyName", label: "Company Name", required: true },
  { name: "industry", label: "Industry" },
  { name: "location", label: "Location" },
  { name: "website", label: "Website" },
  { name: "phone", label: "Phone" },
  { name: "email", label: "Email" },
];

export default function BusinessSetupForm({ business, onSaved }) {
  const isEdit = Boolean(business);
  const [form, setForm] = useState({
    companyName: business?.companyName || "",
    industry: business?.industry || "",
    location: business?.location || "",
    website: business?.website || "",
    phone: business?.phone || "",
    email: business?.email || "",
    description: business?.description || "",
    story: business?.story || "",
  });
  const [logo, setLogo] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setSuccess(false);
    const payload = { ...form };
    if (logo) payload.logo = logo;
    if (coverImage) payload.coverImage = coverImage;
    try {
      if (isEdit) await businessApi.updateMine(payload);
      else await businessApi.create(payload);
      setSuccess(true);
      if (onSaved) onSaved();
    } catch (err) {
      setError(err.errors ? err.errors.map((x) => x.message).join(", ") : err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="dash-form" onSubmit={submit}>
      {error && <div className="auth-form__error">{error}</div>}
      {success && <div className="dash-form__success">Saved.</div>}
      <p className="dash-form__note">
        {isEdit
          ? "Saving changes sends your profile back for review before it's visible to the public again."
          : "Your profile will be reviewed before it appears publicly."}
      </p>
      <div className="dash-form__grid">
        {FIELDS.map((f) => (
          <label key={f.name}>
            {f.label}
            <input
              required={f.required}
              value={form[f.name]}
              onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
            />
          </label>
        ))}
      </div>
      <label>
        Short Description
        <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </label>
      <label>
        Company Story
        <textarea rows={5} value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })} />
      </label>
      <div className="dash-form__grid">
        <label>Logo <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files[0])} /></label>
        <label>Cover Image <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files[0])} /></label>
      </div>
      <button className="btn btn-accent" disabled={busy} type="submit">
        {busy ? "Saving…" : isEdit ? "Save Changes" : "Create Business Profile"}
      </button>
    </form>
  );
}
