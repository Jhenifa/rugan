import { useEffect } from "react";
import { useLocation } from "react-router";

const GA_MEASUREMENT_ID =
  import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() ||
  import.meta.env.VITE_GOOGLE_ANALYTICS_ID?.trim() ||
  "";

export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    if (
      !GA_MEASUREMENT_ID ||
      typeof window === "undefined" ||
      typeof window.gtag !== "function"
    ) {
      return;
    }

    const pagePath = `${location.pathname}${location.search}${location.hash}`;
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [location]);

  return null;
}
