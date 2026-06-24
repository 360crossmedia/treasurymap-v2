"use client";
import styles from "../styles/about.module.css";

const I = {
  info: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>,
  grid: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  target: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="0.6" fill="currentColor"/></svg>,
  layers: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  refresh: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>,
  arrow: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  mail: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>,
};

const CARDS = [
  { icon: I.grid, title: "15 categories", text: "Every solution is organised into the functional domain it serves, from TRMS and ERP through to payments, FX, bank connectivity, data and analytics." },
  { icon: I.target, title: "One primary category per vendor", text: "Each provider sits in the category that best represents its main focus, so the map stays readable instead of a crowded grid." },
  { icon: I.layers, title: "The Multiplayer Map", text: "A second view reveals every category a provider really covers, so you can tell platform players from point solutions." },
  { icon: I.refresh, title: "Always current", text: "The map is updated regularly to reflect new entrants, M&A activity, rebranding and shifting category boundaries." },
];

const About = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <span className={styles.eyebrow}>{I.info} About</span>
          <h1 className={styles.title}>The independent treasury technology map</h1>
          <p className={styles.intro}>
            TreasuryMap.com is the independent, practitioner-curated map of the treasury
            technology landscape. It gives corporate treasurers, CFOs and treasury teams a clear,
            structured view of the whole market, organised into 15 functional categories, so they
            can navigate a crowded field and build a shortlist before an RFP ever begins.
          </p>
        </header>

        <div className={styles.lead}>
          <strong>In a sector dominated by vendor marketing, an independent reference is rare.</strong>{" "}
          That independence is the point.
        </div>

        <h2 className={styles.sectionTitle}>How the map works</h2>
        <section className={styles.grid}>
          {CARDS.map((c) => (
            <article className={styles.card} key={c.title}>
              <div className={styles.cardIcon}>{c.icon}</div>
              <h3 className={styles.cardTitle}>{c.title}</h3>
              <p className={styles.cardText}>{c.text}</p>
            </article>
          ))}
        </section>

        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>Independent by design</h2>
          <p className={styles.panelText}>
            TreasuryMap is curated by treasury practitioners, not software vendors. How a provider
            is listed, categorised and positioned is an editorial decision, never a commercial one.
            The map is free for treasurers, and we never sell their data.
          </p>
          <p className={styles.panelText}>
            Vendors are listed for free; those who want greater visibility or co-marketing can
            choose a paid profile. A paid profile changes how a listing looks, never whether or
            where it appears. That is how TreasuryMap stays both independent and sustainable.
          </p>
        </section>

        <h2 className={styles.sectionTitle}>Who is behind it</h2>
        <div className={styles.bio}>
          <p className={styles.bioText}>
            TreasuryMap is curated by <strong>François Masquelier</strong>, CEO of Simply Treasury,
            Chairman of ATEL (the Luxembourg Association of Corporate Treasurers) and Chair of EACT
            (the European Association of Corporate Treasurers). With more than 28 years in corporate
            treasury and risk management, and as the author of several books on the subject, he
            brings real practitioner depth to how the market is mapped. TreasuryMap draws on the
            EACT and ATEL networks, which together represent treasury professionals across Europe.
          </p>
        </div>

        <section className={styles.cta}>
          <h2 className={styles.ctaTitle}>Get your solution on the map</h2>
          <p className={styles.ctaText}>
            Are you a treasury technology vendor? If your solution is not yet on the map, or you
            would like an enhanced presence, we would like to hear from you.
          </p>
          <div className={styles.ctaActions}>
            <a className={styles.btnPrimary} href="/signup">Get on the map {I.arrow}</a>
            <a className={styles.btnGhost} href="mailto:studio@360crossmedia.com">{I.mail} studio@360crossmedia.com</a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
