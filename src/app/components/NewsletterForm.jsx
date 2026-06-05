"use client";
import { useState } from "react";
import { apiSubscribeNewsletter } from "../service/apiSubscribeNewsletter";

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 7 10-7" />
  </svg>
);
const Check = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// variant: "footer" (compact, on light) | "panel" (full section)
export default function NewsletterForm({ variant = "footer" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    if (!EMAIL_RE.test(email.trim())) {
      setError("Please enter a valid email address.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    setError("");
    const res = await apiSubscribeNewsletter({ email: email.trim() });
    if (res?.status === 200 && res?.data?.ok) {
      setStatus("sent");
      setEmail("");
    } else {
      setError(res?.data?.error || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className={`nl nl--${variant}`}>
      <div className="nl-head">
        <span className="nl-icn"><MailIcon /></span>
        <div>
          <h3 className="nl-title">Newsletter</h3>
          <p className="nl-sub">Monthly treasury insights &amp; map updates. No spam, unsubscribe anytime.</p>
        </div>
      </div>

      {status === "sent" ? (
        <div className="nl-done"><span className="nl-done-ic"><Check /></span> Thanks! Check your inbox to confirm your subscription.</div>
      ) : (
        <form className="nl-form" onSubmit={submit} noValidate>
          <div className="nl-inputwrap">
            <input
              type="email"
              className="nl-input"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
              aria-label="Email address"
            />
            <button type="submit" className="nl-btn" disabled={status === "sending"}>
              {status === "sending" ? "Subscribing…" : "Subscribe"}
            </button>
          </div>
          {status === "error" && <p className="nl-err">{error}</p>}
        </form>
      )}

      <style jsx>{`
        .nl { font-family: "Chivo", system-ui, -apple-system, sans-serif; }
        .nl-head { display: flex; align-items: flex-start; gap: 11px; margin-bottom: 12px; }
        .nl-icn { flex-shrink: 0; width: 34px; height: 34px; border-radius: 9px; display: grid; place-items: center; background: #eef4ff; color: #2f6fe0; }
        .nl-title { margin: 0; font-size: 15px; font-weight: 800; color: #0e2c5c; letter-spacing: -.01em; }
        .nl-sub { margin: 2px 0 0; font-size: 12.5px; color: #6a788f; line-height: 1.45; max-width: 340px; }
        .nl-form { width: 100%; }
        .nl-inputwrap { display: flex; gap: 8px; flex-wrap: wrap; }
        .nl-input { flex: 1; min-width: 180px; border: 1.5px solid #dce4ef; border-radius: 100px; padding: 10px 16px; font-size: 14px; color: #0e2c5c; outline: none; background: #fff; transition: border-color .15s, box-shadow .15s; }
        .nl-input:focus { border-color: #2f6fe0; box-shadow: 0 0 0 3px rgba(47,111,224,.12); }
        .nl-input::placeholder { color: #9aa3b5; }
        .nl-btn { flex-shrink: 0; border: none; border-radius: 100px; padding: 10px 22px; font-size: 14px; font-weight: 700; color: #fff; cursor: pointer; background: linear-gradient(135deg,#4D8DFF,#2f6fe0); box-shadow: 0 8px 18px -7px rgba(47,111,224,.6); transition: transform .15s; }
        .nl-btn:hover:not(:disabled) { transform: translateY(-1px); }
        .nl-btn:disabled { opacity: .65; cursor: default; }
        .nl-err { margin: 8px 0 0; font-size: 12.5px; color: #c0392b; font-weight: 600; }
        .nl-done { display: flex; align-items: center; gap: 9px; font-size: 13.5px; font-weight: 600; color: #1f8a52; background: #eafaf0; border: 1px solid #bdebcd; border-radius: 12px; padding: 12px 16px; }
        .nl-done-ic { display: grid; place-items: center; }

        /* Panel variant — centered section on a light background */
        .nl--panel { text-align: center; max-width: 560px; margin: 0 auto; }
        .nl--panel .nl-head { flex-direction: column; align-items: center; gap: 10px; }
        .nl--panel .nl-icn { width: 44px; height: 44px; border-radius: 12px; }
        .nl--panel .nl-title { font-size: 22px; }
        .nl--panel .nl-sub { font-size: 14px; max-width: 420px; }
        .nl--panel .nl-inputwrap { max-width: 460px; margin: 0 auto; }
        .nl--panel .nl-done { justify-content: center; }
      `}</style>
    </div>
  );
}
