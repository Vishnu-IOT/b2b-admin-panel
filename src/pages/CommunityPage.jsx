import React from "react";
import { QuestionsFeed } from "../components/BusinessQA/BusinessQA";
import AskQuestionForm from "../components/BusinessQA/AskQuestionForm";

export default function CommunityPage() {
  const [refreshKey, setRefreshKey] = React.useState(0);
  return (
    <div className="page-shell container" style={{ paddingTop: 40, paddingBottom: 90, maxWidth: 800 }}>
      <p className="eyebrow">Business Community</p>
      <h1 className="section-heading" style={{ fontSize: "clamp(30px,3.6vw,46px)", marginBottom: 10 }}>Ask the Business Community</h1>
      <p className="section-sub" style={{ marginBottom: 26 }}>
        Ask a question, or help another business by answering one.
      </p>
      <AskQuestionForm onCreated={() => setRefreshKey((k) => k + 1)} />
      <QuestionsFeed key={refreshKey} />
    </div>
  );
}
