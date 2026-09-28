import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import NewsletterForm from "../Newsletter/NewsletterForm";
import "./footer.css";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="site-footer notranslate">
      <div className="container site-footer__top">
        <div className="site-footer__brand">
          <div className="site-header__logo">
            <span className="site-header__logo-mark">V</span>
            <span className="site-header__logo-text notranslate">Vartha</span>
          </div>
          <p>{t("footer.tagline")}</p>
        </div>

        <div className="site-footer__col">
          <h4>{t("footer.explore")}</h4>
          <Link to="/stories">{t("menu.stories.label")}</Link>
          <Link to="/achievements">{t("menu.achievements.label")}</Link>
          <Link to="/strategies">{t("menu.strategies.label")}</Link>
          <Link to="/products">{t("menu.products.label")}</Link>
          <Link to="/videos">{t("menu.videos.label")}</Link>
        </div>
        <div className="site-footer__col">
          <h4>{t("footer.resources")}</h4>
          <Link to="/resources?category=marketing">Marketing</Link>
          <Link to="/resources?category=gst">GST</Link>
          <Link to="/resources?category=msme">MSME</Link>
          <Link to="/resources?category=startup">Startup</Link>
        </div>
        <div className="site-footer__col">
          <h4>{t("footer.community")}</h4>
          <Link to="/community">{t("menu.qa.label")}</Link>
          <Link to="/enquiries">{t("menu.enquiries.label")}</Link>
          <Link to="/register">{t("nav.joinNetwork")}</Link>
        </div>
        <div className="site-footer__col site-footer__col--newsletter">
          <NewsletterForm variant="footer" />
        </div>
      </div>
      <div className="divider" />
      <div className="container site-footer__bottom">
        <p>{t("footer.rights")}</p>
        <p>{t("footer.disclaimer")}</p>
      </div>
    </footer>
  );
}
