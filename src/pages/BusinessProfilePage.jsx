import React from "react";
import { useParams, Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { businessApi } from "../api/endpoints";
import BusinessProfile from "../components/BusinessProfile/BusinessProfile";
import { Loading, ErrorMessage } from "../components/common/StateMessage";

export default function BusinessProfilePage() {
  const { idOrSlug } = useParams();
  const {
    data: business,
    loading,
    error,
    refetch,
  } = useFetch(() => businessApi.getOne(idOrSlug), [idOrSlug]);

  if (loading)
    return (
      <div className="page-shell container" style={{ paddingTop: 140 }}>
        <Loading />
      </div>
    );

  if (error) {
    return (
      <div
        className="page-shell container"
        style={{ paddingTop: 140, paddingBottom: 100 }}
      >
        <h2 className="section-heading">Business not found</h2>
        <ErrorMessage error={error} onRetry={refetch} />
        <Link
          to="/"
          className="btn btn-primary"
          style={{ marginTop: 20, display: "inline-flex" }}
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return <BusinessProfile business={business} />;
}
