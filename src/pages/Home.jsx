import React from "react";
import Hero from "../components/Hero/Hero";
import BusinessStorySection from "../components/BusinessStory/BusinessStorySection";
import AchievementsPreview from "../components/Achievements/Achievements";
import StrategiesPreview from "../components/Strategies/Strategies";
import ProductShowcase from "../components/ProductShowcase/ProductShowcase";
import EnquiriesPreview from "../components/Enquiries/Enquiries";
import VideosPreview from "../components/Videos/Videos";
import BusinessQAPreview from "../components/BusinessQA/BusinessQA";
import ResourceHubPreview from "../components/ResourceHub/ResourceHub";

// Homepage hierarchy: Featured Story -> Latest Stories -> Achievements ->
// Strategies -> Products -> Supplier Enquiries -> Videos -> Q&A -> Resources
export default function Home() {
  return (
    <>
      <Hero />
      <BusinessStorySection />
      <AchievementsPreview />
      <StrategiesPreview />
      <ProductShowcase />
      <EnquiriesPreview />
      <VideosPreview />
      <BusinessQAPreview />
      <ResourceHubPreview />
    </>
  );
}
