"use client";
import { newsletter } from "../config/newsletter";

// Newsletter signup. Opens Zoho Campaigns' own hosted sign-up form in a new tab
// (config/newsletter.js `optinUrl`), so Zoho handles the email capture and
// opt-in. Renders nothing until the list is configured, so there is never a
// broken form on the live site.
export default function NewsletterForm({ variant = "banner" }) {
  if (!newsletter.enabled || !newsletter.optinUrl) return null;
  const isFooter = variant === "footer";

  return (
    <section className={`nl ${isFooter ? "nl--footer" : "nl--banner"}`} aria-label="Newsletter signup">
      <div className="nl-inner">
        {isFooter ? (
          <>
            <span className="nl-label">Newsletter</span>
            <p className="nl-footSub">Treasury technology news, straight to your inbox.</p>
          </>
        ) : (
          <div className="nl-copy">
            <h2 className="nl-title">Stay ahead of treasury technology</h2>
            <p className="nl-sub">
              The latest providers, integrations and insights from the Treasury Technology Map, straight to your inbox.
            </p>
          </div>
        )}

        <a className="nl-btn" href={newsletter.optinUrl} target="_blank" rel="noopener noreferrer">
          Subscribe
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </a>
      </div>
      {styleTag}
    </section>
  );
}

const styleTag = (
  // Global (module-level const, outside the component's JSX scope): scoped
  // styled-jsx would generate a jsx-<hash> class that never lands on the .nl-*
  // elements. The nl- prefix keeps these class names collision-free.
  <style jsx global>{`
    .nl { font-family: 'Inter', system-ui, -apple-system, sans-serif; }

    /* Banner (top of Insights) */
    .nl--banner {
      background: linear-gradient(135deg, #0e2c5c 0%, #1e478f 55%, #2f6fe0 100%);
      border-radius: 16px; padding: 28px 32px; margin: 0 0 28px 0;
      box-shadow: 0 8px 26px rgba(14, 44, 92, 0.18);
    }
    .nl--banner .nl-inner {
      display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap;
    }
    .nl--banner .nl-copy { flex: 1 1 340px; min-width: 260px; }
    .nl--banner .nl-title { color: #fff; font-size: 1.45rem; font-weight: 800; margin: 0 0 6px; letter-spacing: -0.3px; line-height: 1.15; }
    .nl--banner .nl-sub { color: rgba(255,255,255,0.86); font-size: 0.95rem; margin: 0; line-height: 1.5; max-width: 460px; }
    .nl--banner .nl-btn { background: #19a3e6; color: #fff; }
    .nl--banner .nl-btn:hover { background: #0f8fce; }

    /* Footer variant (slim, light) */
    .nl--footer { border-top: 1px solid #e1e7f1; padding: 22px 0 6px; margin: 0 0 6px; }
    .nl--footer .nl-inner { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; }
    .nl--footer .nl-label { text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.72rem; font-weight: 700; color: #2f6fe0; }
    .nl--footer .nl-footSub { margin: 0 0 8px; font-size: 0.86rem; color: #6a788f; }
    .nl--footer .nl-btn { background: #2f6fe0; color: #fff; }
    .nl--footer .nl-btn:hover { background: #1e478f; }

    /* Shared button */
    .nl-btn {
      display: inline-flex; align-items: center; gap: 8px; height: 44px; padding: 0 22px;
      border: none; border-radius: 10px; font-size: 0.95rem; font-weight: 700; cursor: pointer;
      white-space: nowrap; text-decoration: none; transition: background 0.15s, transform 0.1s;
    }
    .nl-btn:hover { transform: translateY(-1px); }
    .nl-btn svg { transition: transform 0.15s; }
    .nl-btn:hover svg { transform: translateX(2px); }

    @media (max-width: 640px) {
      .nl--banner { padding: 22px 20px; }
      .nl--banner .nl-title { font-size: 1.25rem; }
    }
  `}</style>
);
