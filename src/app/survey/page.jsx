import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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
          <div className={styles.inner}>
            <span className={styles.eyebrow}>// Treasury Technology Survey 2026</span>
            <div className={styles.cobrand}>
              <b>TreasuryMap</b> in partnership with <b>EACT</b>
            </div>
            <h1 className={styles.h1}>How do European corporates really choose their treasury technology?</h1>
            <p className={styles.lead}>
              The independent benchmark of how treasury teams select, use and rate their technology.
              Add your voice in a few minutes. The aggregated results feed the TreasuryMap landscape
              and the EACT community, and you get the findings first.
            </p>
            <div className={styles.meta}>
              <span><span className={styles.dot}>&bull;</span> Around 5 minutes</span>
              <span><span className={styles.dot}>&bull;</span> Anonymous and aggregated</span>
              <span><span className={styles.dot}>&bull;</span> Results shared with every respondent</span>
            </div>
          </div>
        </section>

        <section className={styles.embedWrap}>
          <div className={styles.card}>
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
