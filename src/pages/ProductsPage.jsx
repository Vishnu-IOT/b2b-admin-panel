import React from "react";
import { Link, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { productsApi } from "../api/endpoints";
import { fileUrl } from "../api/client";
import { formatDate } from "../utils/text";
import { Loading, ErrorMessage, Empty } from "../components/common/StateMessage";
import ProductCard from "../components/ProductShowcase/ProductCard";
import "../styles/article.css";

function ProductDetail({ slug }) {
  const { data: product, loading, error, refetch } = useFetch(() => productsApi.getOne(slug), [slug]);
  if (loading) return <div className="page-shell container" style={{ paddingTop: 140 }}><Loading /></div>;
  if (error) return <div className="page-shell container" style={{ paddingTop: 140 }}><ErrorMessage error={error} onRetry={refetch} /></div>;
  if (!product) return null;

  const upcoming = product.launchDate && new Date(product.launchDate) > new Date();

  return (
    <article className="page-shell article">
      <div className="container article__head">
        <p className="eyebrow">{upcoming ? "Upcoming Product" : "New Launch"} · {product.business.industry}</p>
        <h1 className="article__headline">{product.name}</h1>
        <div className="article__byline">
          <div className="article__author-avatar">{product.business.companyName.charAt(0)}</div>
          <div>
            <p className="article__author-name">{product.business.companyName}</p>
            <p className="article__author-meta">{upcoming ? "Launching" : "Launched"} {formatDate(product.launchDate)}</p>
          </div>
        </div>
      </div>
      {product.image && (
        <div className="article__hero-image"><img src={fileUrl(product.image)} alt={product.name} /></div>
      )}
      <div className="container article__body">
        {product.description && <p>{product.description}</p>}
        {/* <div className="article__footer-actions">
          <Link to={`/businesses/${product.business.slug}`} className="btn btn-outline">
            View {product.business.companyName}'s Profile
          </Link>
        </div> */}
      </div>
    </article>
  );
}

function ProductsIndex() {
  const { data, loading, error, refetch } = useFetch(() => productsApi.list({ limit: 24 }), []);
  const items = (data && data.items) || [];
  return (
    <div className="page-shell container" style={{ paddingTop: 40, paddingBottom: 90 }}>
      <p className="eyebrow">Product Discovery</p>
      <h1 className="section-heading" style={{ fontSize: "clamp(30px,3.6vw,46px)", marginBottom: 30 }}>New Products</h1>
      {loading && <Loading />}
      {error && <ErrorMessage error={error} onRetry={refetch} />}
      {!loading && !error && !items.length && <Empty>No products published yet.</Empty>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
        {items.map((p) => <ProductCard product={p} key={p.id} />)}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const { slug } = useParams();
  return slug ? <ProductDetail slug={slug} /> : <ProductsIndex />;
}
