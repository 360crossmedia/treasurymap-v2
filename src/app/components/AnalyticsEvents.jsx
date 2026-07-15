"use client";
import { useEffect } from "react";
import { newsletter } from "../config/newsletter";

// Fires two named GA4 events for the actions that actually matter, so they can
// be marked as "key events" (conversions) in GA4:
//   · shortlist_click  → any "Build my shortlist" link (→ /get-my-list)
//   · newsletter_click → any Newsletter / Subscribe link (→ Zoho Optin form)
//
// Delegated at the document level (capture phase) so EVERY such link across the
// site is covered · navbar, footer, category pages, contact, company page, and
// anything added later · without having to wire each button by hand.
export default function AnalyticsEvents() {
  useEffect(() => {
    let optinHost = null;
    try {
      optinHost = newsletter.optinUrl ? new URL(newsletter.optinUrl).host : null;
    } catch {
      optinHost = null;
    }

    const onClick = (e) => {
      const a = e.target?.closest?.("a[href]");
      if (!a || typeof window.gtag !== "function") return;
      const href = a.getAttribute("href") || "";

      if (href.startsWith("/get-my-list")) {
        window.gtag("event", "shortlist_click", { link_location: window.location.pathname });
      } else if (optinHost && href.includes(optinHost)) {
        window.gtag("event", "newsletter_click", { link_location: window.location.pathname });
      }
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
