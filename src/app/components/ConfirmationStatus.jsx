"use client";
// Shared confirmation + live-status component for Long List & Compare Tools.
// Polls GET /api/v1/longlist/status/:id every 3s until "sent" or "failed".

import { useEffect, useState, useRef } from "react";
import { url } from "../service/url";

const STEPS = [
  { key: "pending",    label: "Queued",            icon: <ClockIcon /> },
  { key: "generating", label: "Generating report",  icon: <SpinnerIcon /> },
  { key: "sent",       label: "Sent to your inbox", icon: <CheckIcon /> },
];

export default function ConfirmationStatus({ id, email, type = "longlist" }) {
  const [status, setStatus] = useState("pending");
  const [failed, setFailed] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!id) return;

    const poll = async () => {
      try {
        const res  = await fetch(`${url}/api/v1/longlist/status/${id}`);
        const data = await res.json();
        const s = data.status || "pending";
        setStatus(s);
        if (s !== "sent" && s !== "failed") {
          timerRef.current = setTimeout(poll, 3000);
        }
        if (s === "failed") setFailed(true);
      } catch (_) {
        timerRef.current = setTimeout(poll, 5000); // retry on network error
      }
    };

    poll();
    return () => clearTimeout(timerRef.current);
  }, [id]);

  const currentStep = failed ? -1 : STEPS.findIndex(s => s.key === status);
  const sent = status === "sent";

  const title = type === "compare"
    ? (sent ? "Your comparison is on its way ✓" : "Your comparison is being prepared")
    : (sent ? "Your Long List is on its way ✓" : "Your Long List is being generated");

  const subtitle = type === "compare"
    ? "A side-by-side vendor comparison PDF, delivered to your inbox."
    : "A personalised selection report, curated by AI, delivered to your inbox.";

  const timing = type === "compare" ? "2–3 minutes" : "4–5 minutes";

  return (
    <div className="cfs-wrap">
      {/* Icon */}
      <div className={`cfs-icon ${sent ? "cfs-icon--sent" : ""} ${failed ? "cfs-icon--failed" : ""}`}>
        {failed ? <FailedIcon /> : sent ? <SentIcon /> : <GeneratingIcon />}
      </div>

      {/* Title */}
      <h1 className="cfs-title">{title}</h1>
      <p className="cfs-subtitle">{subtitle}</p>

      {/* Live progress steps */}
      {!failed && (
        <div className="cfs-steps">
          {STEPS.map((step, i) => {
            const done    = i < currentStep || sent;
            const active  = i === currentStep && !sent;
            return (
              <div key={step.key} className={`cfs-step ${done ? "cfs-step--done" : ""} ${active ? "cfs-step--active" : ""}`}>
                <div className="cfs-step-dot">
                  {done ? <SmallCheck /> : active ? <SmallSpinner /> : null}
                </div>
                <span className="cfs-step-label">{step.label}</span>
                {i < STEPS.length - 1 && <div className={`cfs-step-line ${done ? "cfs-step-line--done" : ""}`} />}
              </div>
            );
          })}
        </div>
      )}

      {/* Email info */}
      <div className="cfs-email-wrap">
        <MailIcon />
        <span>Sending to <strong>{email || "your email"}</strong></span>
      </div>

      {/* Status-specific messages */}
      {sent ? (
        <div className="cfs-success-box">
          Your report has been sent to <strong>{email || "your email"}</strong>.
          <br/>
          <span className="cfs-hint">It should arrive in a few moments — check your spam folder if you don’t see it.</span>
        </div>
      ) : failed ? (
        <div className="cfs-error-box">
          Something went wrong during generation.
          <br/>Please try again or contact us at{" "}
          <a href="mailto:relations@360crossmedia.com">relations@360crossmedia.com</a>
        </div>
      ) : (
        <p className="cfs-hint">
          Generation typically takes {timing}. This page updates automatically.
        </p>
      )}

      {id && <p className="cfs-ref">Reference: #{id}</p>}

      <a href="/" className="cfs-back">← Back to TreasuryMap</a>

      <style jsx>{`
        .cfs-wrap {
          text-align: center;
          padding: 48px 32px;
          max-width: 580px;
          margin: 0 auto;
        }
        .cfs-icon {
          width: 80px; height: 80px; border-radius: 50%;
          background: linear-gradient(135deg, #e8f0fe, #dbeafe);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px;
          box-shadow: 0 8px 24px -8px rgba(47,111,224,.3);
          transition: background .5s;
        }
        .cfs-icon--sent {
          background: linear-gradient(135deg, #d1fae5, #a7f3d0);
          box-shadow: 0 8px 24px -8px rgba(16,185,129,.3);
        }
        .cfs-icon--failed {
          background: linear-gradient(135deg, #fee2e2, #fecaca);
          box-shadow: 0 8px 24px -8px rgba(239,68,68,.3);
        }
        .cfs-title {
          font-size: 1.6rem; font-weight: 700;
          color: #0e2c5c; margin-bottom: 10px;
        }
        .cfs-subtitle {
          color: #5a6a85; font-size: 1rem;
          max-width: 440px; margin: 0 auto 32px; line-height: 1.55;
        }

        /* ── Progress steps ── */
        .cfs-steps {
          display: flex; align-items: center; justify-content: center;
          gap: 0; margin: 0 auto 32px; max-width: 420px; position: relative;
        }
        .cfs-step {
          display: flex; flex-direction: column; align-items: center;
          gap: 8px; flex: 1; position: relative;
        }
        .cfs-step-dot {
          width: 32px; height: 32px; border-radius: 50%;
          border: 2px solid #e1e7f1;
          background: #f8fafc;
          display: flex; align-items: center; justify-content: center;
          z-index: 2; transition: all .3s;
        }
        .cfs-step--done .cfs-step-dot {
          background: #2f6fe0; border-color: #2f6fe0; color: #fff;
        }
        .cfs-step--active .cfs-step-dot {
          border-color: #2f6fe0; background: #eff6ff;
          box-shadow: 0 0 0 4px rgba(47,111,224,.15);
        }
        .cfs-step-label {
          font-size: 11.5px; color: #9aa3b5; font-weight: 500;
          white-space: nowrap;
        }
        .cfs-step--done .cfs-step-label { color: #2f6fe0; font-weight: 600; }
        .cfs-step--active .cfs-step-label { color: #0e2c5c; font-weight: 600; }
        .cfs-step-line {
          position: absolute; top: 15px; left: calc(50% + 16px);
          width: calc(100% - 32px); height: 2px;
          background: #e1e7f1; z-index: 1;
          transition: background .4s;
        }
        .cfs-step-line--done { background: #2f6fe0; }

        /* ── Email ── */
        .cfs-email-wrap {
          display: inline-flex; align-items: center; gap: 8px;
          background: #f4f8ff; border: 1px solid #dbeafe;
          border-radius: 100px; padding: 8px 18px;
          font-size: 14px; color: #3a4a66; margin-bottom: 20px;
        }

        /* ── Status boxes ── */
        .cfs-success-box {
          background: #f0fdf4; border: 1px solid #bbf7d0;
          border-radius: 10px; padding: 14px 20px;
          color: #166534; font-size: 14px; line-height: 1.55;
          margin-bottom: 20px;
        }
        .cfs-error-box {
          background: #fef2f2; border: 1px solid #fecaca;
          border-radius: 10px; padding: 14px 20px;
          color: #991b1b; font-size: 14px; line-height: 1.55;
          margin-bottom: 20px;
        }
        .cfs-hint {
          color: #9aa3b5; font-size: 13px; font-style: italic;
          margin: 0 0 20px;
        }
        .cfs-ref {
          font-size: 12px; color: #c0c8d8;
          font-family: 'JetBrains Mono', monospace; margin-bottom: 24px;
        }
        .cfs-back {
          display: inline-block; color: #2f6fe0; font-weight: 600;
          text-decoration: none; font-size: 14px;
          border-bottom: 1px solid transparent;
          transition: border-color .2s;
        }
        .cfs-back:hover { border-bottom-color: #2f6fe0; }

        /* ── Spinner animation ── */
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>
    </div>
  );
}

// ── Icons ──────────────────────────────────────────────────────────────────

function GeneratingIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2f6fe0" strokeWidth="1.8" strokeLinecap="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
        style={{ animation: "spin 2s linear infinite", transformOrigin: "center" }} />
    </svg>
  );
}

function SentIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z"/>
    </svg>
  );
}

function FailedIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 8v4M12 16h.01"/>
    </svg>
  );
}

function SmallCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  );
}

function SmallSpinner() {
  return (
    <div style={{
      width: 14, height: 14, borderRadius: "50%",
      border: "2px solid #dbeafe", borderTopColor: "#2f6fe0",
      animation: "spin .8s linear infinite",
    }} />
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2f6fe0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="M2 7l10 7 10-7"/>
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9aa3b5" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2f6fe0" strokeWidth="2.5" strokeLinecap="round">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <div style={{
      width: 16, height: 16, borderRadius: "50%",
      border: "2px solid #dbeafe", borderTopColor: "#2f6fe0",
      animation: "spin .8s linear infinite",
    }} />
  );
}
