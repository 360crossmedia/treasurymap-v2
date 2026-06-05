"use client";

const Check = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
);

const PLANS = [
  {
    key: "bronze",
    name: "Bronze",
    accent: "#b87333",
    price: "75€",
    period: "/month",
    note: "+ 150€/month for the Multiplayer Map",
    lead: null,
    features: [
      "Be on the map (your company is validated)",
      "Active link to the basic information you provide",
    ],
    cta: "Get Bronze",
  },
  {
    key: "silver",
    name: "Silver",
    accent: "#7c8aa0",
    price: "200€",
    period: "/month",
    note: null,
    popular: true,
    lead: "Everything in Bronze, plus:",
    features: [
      "1 interview",
      "1 video pitch (1 min)",
      "Distribution of your interview & video pitch on the platform",
      "Publication on your company page",
    ],
    cta: "Get Silver",
  },
  {
    key: "gold",
    name: "Gold",
    accent: "#caa10a",
    price: "350€",
    period: "/month",
    note: null,
    lead: "Everything in Silver, plus:",
    features: [
      "1 video interview",
      "1 photoshoot",
      "Publication of your video interview & photoshoot (Media page + newsletter)",
    ],
    cta: "Get Gold",
  },
];

export default function PricingPlans() {
  return (
    <div className="pp">
      <header className="pp-head">
        <span className="pp-eyebrow">Join the TreasuryMap</span>
        <h1 className="pp-title">Be on the map</h1>
        <p className="pp-sub">
          Be part of the adventure and meet the players of the Treasury landscape.
          Choose the package that fits your visibility goals.
        </p>
      </header>

      <div className="pp-grid">
        {PLANS.map((p) => (
          <div key={p.key} className={`pp-card ${p.popular ? "pop" : ""}`} style={{ "--accent": p.accent }}>
            {p.popular && <span className="pp-badge">Most popular</span>}
            <h2 className="pp-name">{p.name}</h2>
            <div className="pp-price"><span className="pp-amount">{p.price}</span><span className="pp-period">{p.period}</span></div>
            {p.note && <p className="pp-note">{p.note}</p>}
            {p.lead && <p className="pp-lead">{p.lead}</p>}
            <ul className="pp-feats">
              {p.features.map((f, i) => (
                <li key={i}><span className="pp-ic"><Check /></span>{f}</li>
              ))}
            </ul>
            <a className={`pp-cta ${p.popular ? "primary" : ""}`} href="/contactUs">{p.cta}</a>
          </div>
        ))}
      </div>

      <p className="pp-foot">12-month commitment · billed monthly. Prices exclude VAT.</p>

      <div className="pp-contact">
        <p>Not sure which package? We'll guide you.</p>
        <a className="pp-contact-btn" href="/contactUs">Contact us</a>
      </div>

      <style jsx>{`
        .pp { min-height: 70vh; background: radial-gradient(ellipse 100% 40% at 50% 0%, #eef4ff 0%, #eef2f9 55%, #f0f4fa 100%); padding: 52px 24px 80px; font-family: "Chivo", system-ui, -apple-system, sans-serif; }
        .pp-head { text-align: center; max-width: 640px; margin: 0 auto 38px; }
        .pp-eyebrow { font-size: 12px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #2f6fe0; }
        .pp-title { font-size: 2.4rem; font-weight: 800; color: #0e2c5c; letter-spacing: -.01em; margin: 12px 0 12px; }
        .pp-sub { font-size: 1rem; color: #5a6a85; line-height: 1.6; margin: 0; }

        .pp-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; max-width: 1060px; margin: 0 auto; align-items: stretch; }
        .pp-card { position: relative; display: flex; flex-direction: column; background: #fff; border: 1px solid #e6ecf5; border-radius: 20px; padding: 30px 26px 28px; box-shadow: 0 14px 40px -26px rgba(10,26,51,.3); }
        .pp-card.pop { border: 2px solid var(--accent); box-shadow: 0 24px 54px -24px rgba(47,111,224,.35); transform: translateY(-6px); }
        .pp-badge { position: absolute; top: -13px; left: 50%; transform: translateX(-50%); background: var(--accent); color: #fff; font-size: 11px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; padding: 5px 14px; border-radius: 100px; white-space: nowrap; }
        .pp-name { font-size: 1.05rem; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: var(--accent); margin: 0 0 10px; }
        .pp-price { display: flex; align-items: baseline; gap: 4px; }
        .pp-amount { font-size: 2.3rem; font-weight: 800; color: #0e2c5c; letter-spacing: -.02em; }
        .pp-period { font-size: 1rem; color: #8a93a6; font-weight: 600; }
        .pp-note { font-size: 12.5px; color: #6a788f; margin: 6px 0 0; }
        .pp-lead { font-size: 13px; font-weight: 700; color: #0e2c5c; margin: 18px 0 10px; }
        .pp-feats { list-style: none; margin: 16px 0 22px; padding: 0; display: flex; flex-direction: column; gap: 11px; flex: 1; }
        .pp-feats li { display: flex; align-items: flex-start; gap: 10px; font-size: 13.7px; color: #3a4a66; line-height: 1.5; }
        .pp-ic { flex-shrink: 0; width: 21px; height: 21px; border-radius: 6px; display: grid; place-items: center; background: color-mix(in srgb, var(--accent) 14%, #fff); color: var(--accent); margin-top: 1px; }
        .pp-cta { display: block; text-align: center; border-radius: 100px; padding: 12px 20px; font-size: 14.5px; font-weight: 700; text-decoration: none; cursor: pointer; border: 1.5px solid var(--accent); color: var(--accent); background: #fff; transition: transform .15s, background .18s, color .18s; }
        .pp-cta:hover { transform: translateY(-2px); background: color-mix(in srgb, var(--accent) 8%, #fff); }
        .pp-cta.primary { background: var(--accent); color: #fff; box-shadow: 0 10px 22px -8px color-mix(in srgb, var(--accent) 70%, transparent); }

        .pp-foot { text-align: center; font-size: 12.5px; color: #9aa3b5; margin: 22px 0 0; }
        .pp-contact { text-align: center; margin: 40px auto 0; }
        .pp-contact p { font-size: 15px; color: #3a4a66; margin: 0 0 14px; font-weight: 600; }
        .pp-contact-btn { display: inline-block; background: linear-gradient(135deg,#4D8DFF,#2f6fe0); color: #fff; font-weight: 700; font-size: 14.5px; text-decoration: none; padding: 12px 30px; border-radius: 100px; box-shadow: 0 10px 24px -8px rgba(47,111,224,.55); transition: transform .15s; }
        .pp-contact-btn:hover { transform: translateY(-2px); }

        @media (max-width: 880px) {
          .pp-grid { grid-template-columns: 1fr; max-width: 460px; }
          .pp-card.pop { transform: none; }
          .pp-title { font-size: 1.9rem; }
        }
      `}</style>
    </div>
  );
}
