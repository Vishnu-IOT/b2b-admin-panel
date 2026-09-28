import React, { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { storiesApi, strategiesApi, achievementsApi, productsApi, enquiriesApi, videosApi } from "../../api/endpoints";
import { formatDate } from "../../utils/text";
import { Loading, ErrorMessage, Empty } from "../common/StateMessage";
import "./dashboard.css";

const CONFIG = {
  stories: {
    api: storiesApi,
    label: "Business Story",
    fields: [
      { name: "title", label: "Title", required: true },
      { name: "content", label: "Story", type: "textarea", required: true, rows: 8 },
    ],
    fileFields: [{ name: "coverImage", label: "Cover Image" }],
    display: (i) => i.title,
  },
  strategies: {
    api: strategiesApi,
    label: "Strategy",
    fields: [
      { name: "title", label: "Title", required: true },
      { name: "content", label: "Strategy details", type: "textarea", required: true, rows: 8 },
    ],
    fileFields: [{ name: "coverImage", label: "Cover Image" }],
    display: (i) => i.title,
  },
  achievements: {
    api: achievementsApi,
    label: "Achievement",
    fields: [
      { name: "title", label: "Title", required: true },
      { name: "description", label: "Description", type: "textarea", rows: 4 },
      { name: "awardName", label: "Award Name" },
      { name: "awardedBy", label: "Awarded By" },
      { name: "awardDate", label: "Award Date", type: "date" },
    ],
    fileFields: [{ name: "image", label: "Image" }],
    display: (i) => i.title,
  },
  products: {
    api: productsApi,
    label: "Product",
    fields: [
      { name: "name", label: "Product Name", required: true },
      { name: "description", label: "Description", type: "textarea", rows: 4 },
      { name: "launchDate", label: "Launch Date", type: "date" },
    ],
    fileFields: [{ name: "image", label: "Image" }],
    display: (i) => i.name,
  },
  enquiries: {
    api: enquiriesApi,
    label: "Supplier Enquiry",
    fields: [
      { name: "title", label: "Title", required: true },
      { name: "description", label: "Description", type: "textarea", required: true, rows: 4 },
      { name: "category", label: "Category" },
      { name: "location", label: "Location" },
      { name: "contactInfo", label: "Contact Info" },
    ],
    fileFields: [],
    display: (i) => i.title,
  },
  videos: {
    api: videosApi,
    label: "Video",
    fields: [
      { name: "title", label: "Title", required: true },
      { name: "description", label: "Description", type: "textarea", rows: 3 },
      { name: "youtubeUrl", label: "YouTube URL (leave blank if uploading a file)" },
    ],
    fileFields: [
      { name: "video", label: "Upload Video (optional if YouTube URL given)", accept: "video/*" },
      { name: "thumbnail", label: "Thumbnail Image" },
    ],
    display: (i) => i.title,
  },
};

function ItemForm({ config, item, onDone }) {
  const isEdit = Boolean(item);
  const initial = {};
  config.fields.forEach((f) => { initial[f.name] = item ? (item[f.name] || "") : ""; });
  const [form, setForm] = useState(initial);
  const [files, setFiles] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e, status) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const payload = { ...form, ...files, status };
    try {
      if (isEdit) await config.api.update(item.id, payload);
      else await config.api.create(payload);
      onDone();
    } catch (err) {
      setError(err.errors ? err.errors.map((x) => x.message).join(", ") : err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="dash-form" onSubmit={(e) => submit(e, "PENDING")}>
      {error && <div className="auth-form__error">{error}</div>}
      <p className="dash-form__note">
        New and edited content is reviewed before it goes live. Save as a draft to keep working on it privately.
      </p>
      {config.fields.map((f) => (
        <label key={f.name}>
          {f.label}
          {f.type === "textarea" ? (
            <textarea
              required={f.required}
              rows={f.rows || 4}
              value={form[f.name]}
              onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
            />
          ) : (
            <input
              type={f.type === "date" ? "date" : "text"}
              required={f.required}
              value={form[f.name]}
              onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
            />
          )}
        </label>
      ))}
      {config.fileFields.length > 0 && (
        <div className="dash-form__grid">
          {config.fileFields.map((f) => (
            <label key={f.name}>
              {f.label}
              <input type="file" accept={f.accept || "image/*"} onChange={(e) => setFiles({ ...files, [f.name]: e.target.files[0] })} />
            </label>
          ))}
        </div>
      )}
      <div className="dash-form__actions">
        <button type="button" className="btn-link" onClick={() => onDone()}>Cancel</button>
        <button type="button" className="btn btn-outline" disabled={busy} onClick={(e) => submit(e, "DRAFT")}>
          Save as Draft
        </button>
        <button className="btn btn-accent" disabled={busy} type="submit">
          {busy ? "Submitting…" : isEdit ? "Resubmit for Review" : `Submit ${config.label} for Review`}
        </button>
      </div>
    </form>
  );
}

export default function ContentManager({ type }) {
  const config = CONFIG[type];
  const { data, loading, error, refetch } = useFetch(() => config.api.mine({ limit: 50 }), [type]);
  const [mode, setMode] = useState(null); // null | "create" | item object being edited

  const items = (data && data.items) || [];

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await config.api.remove(id);
    refetch();
  };

  const closeForm = (didSave) => {
    setMode(null);
    if (didSave) refetch();
  };

  if (mode === "create" || (mode && typeof mode === "object")) {
    return (
      <ItemForm
        config={config}
        item={typeof mode === "object" ? mode : null}
        onDone={(saved) => closeForm(saved !== false)}
      />
    );
  }

  return (
    <div>
      <div className="dash-list-head">
        <h3>Your {config.label}s</h3>
        <button className="btn btn-accent" onClick={() => setMode("create")}>+ New {config.label}</button>
      </div>
      {loading && <Loading />}
      {error && <ErrorMessage error={error} onRetry={refetch} />}
      {!loading && !error && !items.length && <Empty>Nothing published yet.</Empty>}
      <div className="dash-list">
        {items.map((i) => (
          <div className="dash-list-row" key={i.id}>
            <div>
              <span className={`dash-status dash-status--${(i.status || "published").toLowerCase()}`}>{i.status || "PUBLISHED"}</span>
              <h4>{config.display(i)}</h4>
              <p>{formatDate(i.createdAt)}</p>
            </div>
            <div className="dash-list-row__actions">
              <button className="btn-link" onClick={() => setMode(i)}>Edit</button>
              <button className="btn-link dash-list-row__delete" onClick={() => handleDelete(i.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
