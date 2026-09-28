import React from "react";
import { BusinessDirectoryFull } from "../components/BusinessDirectory/BusinessDirectory";

export default function BusinessesPage() {
  return (
    <div className="page-shell container">
      <div style={{ paddingTop: 40 }}>
        <p className="eyebrow">Business Discovery</p>
        <h1 className="section-heading" style={{ fontSize: "clamp(30px,3.6vw,46px)" }}>Discover Local Businesses</h1>
        <p className="section-sub">Filter by industry and location to find manufacturers, suppliers and service providers near you.</p>
      </div>
      <BusinessDirectoryFull />
    </div>
  );
}
