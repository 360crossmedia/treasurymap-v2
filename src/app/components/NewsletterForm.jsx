"use client";
import { useRef, useState } from "react";
import { newsletter } from "../config/newsletter";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// On-brand newsletter signup backed by Zoho Campaigns. Submits a native form
// POST to a hidden iframe (Zoho's weboptin endpoint sends no CORS headers, so a
// fetch would be blocked; the iframe POST works cross-origin without reading the
// response). We optimistically confirm once the POST is dispatched; Zoho's
// double opt-in then emails the visitor a confirmation link.
//
// Renders nothing until the Zoho list is configured (config/newsletter.js), so
// there is never a broken form on the live site.
export default function NewsletterForm({ variant = "banner" }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle"); // idle | error | submitting | done
  const formRef = useRef(null);

  if (!newsletter.enabled) return null;

  const onSubmit = (e) => {
    if (!EMAIL_RE.test(email.trim())) {
      e.preventDefault();
      setState("error");
      return;
    }
    // Valid: let the native form POST to the hidden iframe, then confirm.
    setState("submitting");
    setTimeout(() => setState("done"), 600);
  };

  const isFooter = variant === "footer";

  if (state === "done") {
    return (
      <div className={`nl ${isFooter ? "nl--footer" : "nl--banner"} nl--done`}>
        <div className="nl-inner">
          <svg className="nl-check" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          <p className="nl-doneMsg">
            Almost there. Check your inbox to confirm your subscription.
          </p>
        </div>
        {styleTag}
      </div>
    );
  }

  return (
    <section className={`nl ${isFooter ? "nl--footer" : "nl--banner"}`} aria-label="Newsletter signup">
      <iframe name="tm_zoho_target" title="newsletter" style={{ display: "none" }} />
      <div className="nl-inner">
        {!isFooter && (
          <div className="nl-copy">
            <h2 className="nl-title">Stay ahead of treasury technology</h2>
            <p className="nl-sub">
              The latest providers, integrations and insights from the Treasury Technology Map, straight to your inbox.
            </p>
          </div>
        )}
        {isFooter && <span className="nl-label">Newsletter</span>}

        <form
          ref={formRef}
          className="nl-form"
          action={newsletter.action}
          method="POST"
          target="tm_zoho_target"
          onSubmit={onSubmit}
          noValidate
        >
          {Object.entries(newsletter.hidden).map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v} />
          ))}
          {/* Honeypot kept empty; Zoho ignores unknown fields. */}
          <div className="nl-row">
            <input
              className="nl-input"
              type="email"
              name={newsletter.emailField}
              placeholder="you@company.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (state === "error") setState("idle"); }}
              aria-label="Email address"
              aria-invalid={state === "error"}
            />
            <button className="nl-btn" type="submit" disabled={state === "submitting"}>
              {state === "submitting" ? "Subscribing…" : "Subscribe"}
            </button>
          </div>
          {state === "error" && <span className="nl-err">Please enter a valid email address.</span>}
          <span className="nl-gdpr">
            By subscribing you agree to receive our newsletter. Unsubscribe anytime. See our{" "}
            <a href="/gdpr">Privacy policy</a>.
          </span>
        </form>
      </div>
      {styleTag}
    </section>
  );
}

// Global (not scoped): this <style> lives in a module-level const, outside the
// component's JSX scope, so scoped styled-jsx would generate a jsx-<hash> class
// that never lands on the .nl-* elements and the form would render unstyled.
// The nl- prefix keeps these class names collision-free.
const styleTag = (
  <style jsx global>{`
    .nl { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
    .nl-inner { width: 100%; }

    /* Banner (top of Insights) */
    .nl--banner {
      background: linear-gradient(135deg, #0e2c5c 0%, #1e478f 55%, #2f6fe0 100%);
      border-radius: 16px;
      padding: 28px 32px;
      margin: 0 0 28px 0;
      box-shadow: 0 8px 26px rgba(14, 44, 92, 0.18);
      display: flex;
    }
    .nl--banner .nl-inner {
      display: flex; align-items: center; justify-content: space-between;
      gap: 28px; flex-wrap: wrap;
    }
    .nl--banner .nl-copy { flex: 1 1 320px; min-width: 260px; }
    .nl--banner .nl-title {
      color: #fff; font-size: 1.45rem; font-weight: 800; margin: 0 0 6px;
      letter-spacing: -0.3px; line-height: 1.15;
    }
    .nl--banner .nl-sub { color: rgba(255,255,255,0.86); font-size: 0.95rem; margin: 0; line-height: 1.5; max-width: 460px; }
    .nl--banner .nl-form { flex: 1 1 360px; min-width: 280px; }
    .nl--banner .nl-input {
      background: rgba(255,255,255,0.97); border: 1px solid transparent;
      color: #0e2c5c;
    }
    .nl--banner .nl-btn { background: #19a3e6; color: #fff; }
    .nl--banner .nl-btn:hover { background: #0f8fce; }
    .nl--banner .nl-gdpr { color: rgba(255,255,255,0.7); }
    .nl--banner .nl-gdpr a { color: rgba(255,255,255,0.92); }
    .nl--banner .nl-err { color: #ffd9d9; }

    /* Footer variant (slim, light) */
    .nl--footer {
      border-top: 1px solid #e1e7f1;
      padding: 22px 0 6px;
      margin: 0 0 6px;
    }
    .nl--footer .nl-inner { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
    .nl--footer .nl-label {
      text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.72rem;
      font-weight: 700; color: #2f6fe0; white-space: nowrap;
    }
    .nl--footer .nl-form { width: 100%; max-width: 460px; }
    .nl--footer .nl-input { background: #fff; border: 1px solid #d7deea; color: #0e2c5c; }
    .nl--footer .nl-btn { background: #2f6fe0; color: #fff; }
    .nl--footer .nl-btn:hover { background: #1e478f; }
    .nl--footer .nl-gdpr { color: #9aa3b5; }
    .nl--footer .nl-gdpr a { color: #2f6fe0; }
    .nl--footer .nl-err { color: #c0392b; }

    /* Shared form bits */
    .nl-row { display: flex; gap: 8px; flex-wrap: wrap; }
    .nl-input {
      flex: 1 1 200px; min-width: 0; height: 44px; padding: 0 14px;
      border-radius: 10px; font-size: 0.95rem; outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .nl-input:focus { border-color: #19a3e6; box-shadow: 0 0 0 3px rgba(25,163,230,0.25); }
    .nl-btn {
      height: 44px; padding: 0 22px; border: none; border-radius: 10px;
      font-size: 0.95rem; font-weight: 700; cursor: pointer; white-space: nowrap;
      transition: background 0.15s, transform 0.1s;
    }
    .nl-btn:hover { transform: translateY(-1px); }
    .nl-btn:disabled { opacity: 0.7; cursor: default; transform: none; }
    .nl-gdpr { display: block; margin-top: 10px; font-size: 0.74rem; line-height: 1.4; }
    .nl-gdpr a { text-decoration: underline; }
    .nl-err { display: block; margin-top: 8px; font-size: 0.8rem; font-weight: 600; }

    /* Done state */
    .nl--done .nl-inner { display: flex; align-items: center; gap: 12px; }
    .nl--banner.nl--done { align-items: center; }
    .nl-check { flex: 0 0 auto; }
    .nl--banner .nl-check { color: #fff; }
    .nl--footer .nl-check { color: #10b981; }
    .nl-doneMsg { margin: 0; font-size: 0.95rem; font-weight: 600; }
    .nl--banner .nl-doneMsg { color: #fff; }
    .nl--footer .nl-doneMsg { color: #0e2c5c; }

    @media (max-width: 640px) {
      .nl--banner { padding: 22px 20px; }
      .nl--banner .nl-title { font-size: 1.25rem; }
    }
  `}</style>
);
