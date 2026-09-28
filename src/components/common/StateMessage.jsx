import React from "react";
import "./state.css";

export function Loading({ label = "Loading…" }) {
  return <div className="state-msg state-msg--loading">{label}</div>;
}

export function ErrorMessage({ error, onRetry }) {
  const message = (error && error.message) || "Something went wrong.";
  return (
    <div className="state-msg state-msg--error">
      <p>{message}</p>
      {onRetry && <button className="btn btn-outline" onClick={onRetry}>Try again</button>}
    </div>
  );
}

export function Empty({ children }) {
  return <div className="state-msg state-msg--empty">{children}</div>;
}
