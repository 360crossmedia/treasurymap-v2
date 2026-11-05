import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import eactLogo from "../assets/eact-logo-white.png";
import styles from "./survey.module.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://treasurymap-v2-production.up.railway.app";

// Live Zoho form (Treasury Technology Survey 2026), run with the EACT. Embedded
// as a responsive iframe · Zoho posts its height to the parent, and the inline
// listener below resizes the frame so the whole form shows without an inner
// scrollbar. Change this one URL to point at a new survey edition.
const ZOHO_FORM_URL =
  "https://forms.zohopublic.eu/contact1221/form/TreasuryTechnologySurvey2025EACT/formperma/iaK301Fs5LVqea5Z9zaXNmU3whrW2GwBf4fanu7YLbA";

// Zoho's official responsive-resize listener, scoped to our container.
const ZOHO_RESIZE = `
(function () {
  window.addEventListener("message", function (event) {
    var data = event.data;
    if (!data || typeof data !== "string") return;
    var parts = data.split("|");
    if (parts.length < 2) return;
    var perma = parts[0];
    var h = (parseInt(parts[1], 10) + 15) + "px";
    var c = document.getElementById("zf_div_survey");
    if (!c) return;
    var f = c.getElementsByTagName("iframe")[0];
    if (!f) return;
    if (f.src.indexOf("formperma") > 0 && f.src.indexOf(perma) > 0 && f.style.height !== h) {
      f.style.height = h;
    }
  }, false);
})();
`;

export const metadata = {
  title: "Treasury Technology Survey 2026",
  description:
    "The independent benchmark of how European corporates choose and use treasury technology. Run by TreasuryMap in partnership with the EACT. Add your voice in a few minutes.",
  alternates: { canonical: "/survey" },
  openGraph: {
    title: "Treasury Technology Survey 2026 | TreasuryMap",
    description:
      "Run by TreasuryMap in partnership with the EACT. Add your voice in a few minutes and get the findings first.",
    url: `${SITE_URL}/survey`,
    type: "website",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Survey", item: `${SITE_URL}/survey` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/survey`,
      name: "Treasury Technology Survey 2026",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: "Treasury technology adoption benchmark for European corporates.",
    },
  ],
};

export default function SurveyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <Navbar buttonLabel="Log In" />

      <main className={styles.page}>
        <section className={styles.hero}>
          {/* constellation motif · dot grid + a few mint nodes/links */}
          <span className={styles.dots} aria-hidden="true" />
          <svg className={styles.constellation} viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <g stroke="#34e0a1" strokeWidth="1" opacity="0.5" fill="none">
              <path d="M120 70 L300 150 L240 300 M300 150 L520 110" />
              <path d="M980 90 L860 210 L1040 260 M860 210 L720 150" />
            </g>
            <g fill="#34e0a1">
              <circle cx="120" cy="70" r="3.5" /><circle cx="300" cy="150" r="4" />
              <circle cx="240" cy="300" r="3" /><circle cx="520" cy="110" r="3" />
              <circle cx="980" cy="90" r="3.5" /><circle cx="860" cy="210" r="4" />
              <circle cx="1040" cy="260" r="3" /><circle cx="720" cy="150" r="3" />
            </g>
          </svg>

          <div className={styles.inner}>
            <div className={styles.cobrand}>
              <b>TreasuryMap</b>
              <span className={styles.cobrandSep}>in partnership with</span>
              <img src={eactLogo.src} alt="EACT" className={styles.eactLogo} />
            </div>
            <span className={styles.eyebrow}>Treasury Technology Survey 2026</span>
            <h1 className={styles.h1}>How do European corporates really choose their treasury technology?</h1>
            <p className={styles.lead}>
              The independent benchmark every treasurer should shape. Add your voice in five minutes.
            </p>

            <div className={styles.chips}>
              <span className={styles.chip}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                5 minutes
              </span>
              <span className={styles.chip}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
                Anonymous
              </span>
              <span className={styles.chip}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M5 12v9h14v-9M12 8C12 8 11 3 8 3a2.5 2.5 0 0 0 0 5h8a2.5 2.5 0 0 0 0-5c-3 0-4 5-4 5z"/></svg>
                Results first
              </span>
            </div>

            <div className={styles.stats}>
              <span><b>234</b> solutions mapped</span>
              <span className={styles.statDot}>&bull;</span>
              <span><b>15</b> categories</span>
              <span className={styles.statDot}>&bull;</span>
              <span>Backed by the <b>EACT</b></span>
            </div>
          </div>
        </section>

        <section className={styles.embedWrap}>
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.cardDot} aria-hidden="true" />
              6 quick steps · about 5 minutes · your answers stay anonymous
            </div>
            <div id="zf_div_survey">
              <iframe
                title="Treasury Technology Survey 2026"
                src={ZOHO_FORM_URL}
                className={styles.frame}
                style={{ height: "1200px" }}
                loading="lazy"
                aria-label="Treasury Technology Survey 2026"
              />
            </div>
          </div>
          <p className={styles.note}>
            Having trouble with the form?{" "}
            <a href={ZOHO_FORM_URL} target="_blank" rel="noopener noreferrer">
              Open it in a new tab &rarr;
            </a>
          </p>
        </section>
      </main>

      <Footer />
      <script dangerouslySetInnerHTML={{ __html: ZOHO_RESIZE }} />
    </>
  );
}
