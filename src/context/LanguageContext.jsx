import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "vartha_lang";
const LanguageContext = createContext(null);

function readGoogTransCookie() {
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
  if (!match) return null;
  const val = decodeURIComponent(match[1]); // looks like "/en/ta"
  const parts = val.split("/").filter(Boolean);
  return parts[1] || null; // the target language, e.g. "ta"
}

/**
 * Static UI text (nav, footer, page headings) is fetched at runtime from
 * /public/i18n/en.json and /public/i18n/ta.json. Dynamic content that comes
 * back from the backend API (achievement/story/strategy content, products,
 * etc.) is translated separately, in the browser, by the Google Translate
 * widget in Header.jsx — there's no Tamil field for it on the backend.
 *
 * Those are two independent systems, so switching language needs to move
 * both together or they drift apart (e.g. header stays Tamil while the
 * page content goes English). switchLanguage() below is the single place
 * that does that: it writes our own preference AND Google's "googtrans"
 * cookie, then reloads the page so both boot up already agreeing — this is
 * far more reliable than trying to flip Google's live translation in place,
 * which is known to be flaky inside a React SPA.
 */
export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "ta") return saved;
    const cookieLang = typeof document !== "undefined" ? readGoogTransCookie() : null;
    return cookieLang === "en" || cookieLang === "ta" ? cookieLang : "ta"; // Tamil is the default/primary language
  });
  const [dictionaries, setDictionaries] = useState({ en: {}, ta: {} });
  const [loaded, setLoaded] = useState(false);

  // Fetch both JSON dictionaries once, at runtime, from /public/i18n/*.json
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/i18n/en.json").then((r) => r.json()),
      fetch("/i18n/ta.json").then((r) => r.json()),
    ])
      .then(([en, ta]) => {
        if (!cancelled) {
          setDictionaries({ en, ta });
          setLoaded(true);
        }
      })
      .catch((err) => {
        console.error("Failed to load static UI translations:", err);
        if (!cancelled) setLoaded(true); // fall through to key-as-fallback rather than block the UI
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("lang", lang === "ta" ? "ta" : "en");
  }, [lang]);

  // The one true way to change language: syncs our JSON-driven chrome and
  // Google's page-content translation, then reloads so both apply cleanly.
  const switchLanguage = (newLang) => {
    if (newLang !== "en" && newLang !== "ta") return;
    if (newLang === lang) return;
    localStorage.setItem(STORAGE_KEY, newLang);
    document.cookie = `googtrans=/en/${newLang};path=/`;
    window.location.reload();
  };

  // Stay in sync if someone uses Google's own dropdown instead of ours.
  useEffect(() => {
    const handler = (e) => {
      const el = e.target;
      if (el && el.classList && el.classList.contains("goog-te-combo")) {
        const newLang = el.value === "ta" ? "ta" : "en";
        switchLanguage(newLang);
      }
    };
    document.addEventListener("change", handler);
    return () => document.removeEventListener("change", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const value = useMemo(() => {
    const dict = dictionaries[lang] || dictionaries.ta || {};
    const fallback = dictionaries.ta || {};
    const t = (key) => (dict[key] !== undefined ? dict[key] : fallback[key] !== undefined ? fallback[key] : key);
    const toggleLang = () => switchLanguage(lang === "ta" ? "en" : "ta");
    return { lang, switchLanguage, toggleLang, t, loaded };
  }, [lang, dictionaries, loaded]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside a LanguageProvider");
  return ctx;
}
