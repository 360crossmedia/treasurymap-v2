"use client";

// Compact onboarding strip shown only on the homepage (above the map). Gives a
// first-time visitor a one-line value prop.
export default function HomeIntro() {
  return (
    <section className="hi">
      <div className="hi-inner">
        <div className="hi-copy">
          <h1 className="hi-title">
            Find the right <span>treasury technology</span>, visually.
          </h1>
          <p className="hi-sub">Explore vetted providers across every treasury category, or answer 10 quick questions to get a personalised shortlist.</p>
        </div>
      </div>

      <style jsx>{`
        .hi {
          background: linear-gradient(180deg, #ffffff, #f3f7ff);
          border-bottom: 1px solid #eaeef5;
        }
        .hi-inner {
          max-width: 1180px;
          margin: 0 auto;
          padding: 16px 22px;
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }
        .hi-copy { flex: 1; min-width: 280px; }
        .hi-title {
          font-size: 22px;
          line-height: 1.2;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #0f1b33;
          margin: 0;
        }
        .hi-title span { color: #2f6fe0; }
        .hi-sub {
          font-size: 13.5px;
          color: #566072;
          margin: 5px 0 0;
        }
        .hi-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .hi-toggle {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 13px;
          color: #5a6577;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 0;
        }
        .hi-i {
          display: inline-grid;
          place-items: center;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1.5px solid #9aa6bb;
          font-size: 10px;
          font-style: italic;
          font-weight: 700;
          color: #6b7587;
        }
        .hi-legend {
          max-width: 1180px;
          margin: 0 auto;
          padding: 2px 22px 18px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px 24px;
        }
        .hi-code {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 12.5px;
          color: #48515f;
        }
        .hi-dot { width: 9px; height: 9px; border-radius: 50%; flex: none; }
        .hi-code b { min-width: 42px; color: #0f1b33; font-weight: 800; }
        .hi-name { color: #6b7587; }
        @media (max-width: 760px) {
          .hi-legend { grid-template-columns: repeat(2, 1fr); }
          .hi-title { font-size: 19px; }
        }
      `}</style>
    </section>
  );
}
