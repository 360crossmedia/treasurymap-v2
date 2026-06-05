"use client";
import styles from "../styles/gdpr.module.css";

const I = {
  shield: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  collect: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6H4M16 12H4M12 18H4"/></svg>,
  why: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>,
  lock: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  clock: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  out: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
  trash: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
};

const CARDS = [
  { icon: I.collect, title: "What we need", text: "360CROSSMEDIA only collects basic personal data about its contacts: your email address, name, company name and job title as a minimum. Depending on how far you have completed your profile on our form, we might also hold your nationality, spoken languages, address and phone. If we have called or met you, we sometimes save key information about our conversations in our CRM to serve you better." },
  { icon: I.why, title: "Why we need it", text: "We need your basic personal data to provide you with invoices, newsletters, events information, invitations, magazines and special offers. We will not collect any personal data from you that we do not need." },
  { icon: I.lock, title: "What we do with it", text: "All the personal data we hold is processed in our CRM, whose servers are located in Europe. All our employees sign an NDA together with their contract before touching any computer. Our CEO is the only admin of our CRM. No third parties have access to your personal data unless the law requires it. We never sell or provide data to any company." },
  { icon: I.clock, title: "How long we keep it", text: "Your information is kept until you notify us that you no longer wish 360CROSSMEDIA to keep it. Each newsletter is sent with an “opt out” button (you stop receiving the newsletter) and an “All out” button (we erase all data about you in our CRM)." },
];

const Gdpr = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.hero}>
          <span className={styles.eyebrow}>{I.shield} Privacy</span>
          <h1 className={styles.title}>GDPR Privacy Notice</h1>
          <p className={styles.intro}>
            Following the General Data Protection Regulation (GDPR) on data protection and
            privacy for all individuals within the European Union and the European Economic
            Area, TreasuryMap is addressing the handling of its contacts&rsquo; personal data.
          </p>
          <span className={styles.updated}>Last updated: June 2026</span>
        </header>

        <div className={styles.lead}>
          <strong>Your Personal Data: Contact (definition).</strong> Clients, prospects, people
          attending events for which we are partners, people connecting with our team during
          events or business meetings, and people subscribing to our newsletters and magazines.
        </div>

        <section className={styles.grid}>
          {CARDS.map((c) => (
            <article className={styles.card} key={c.title}>
              <div className={styles.cardIcon}>{c.icon}</div>
              <h2 className={styles.cardTitle}>{c.title}</h2>
              <p className={styles.cardText}>{c.text}</p>
            </article>
          ))}
        </section>

        <div className={styles.manage}>
          <div className={styles.manageCopy}>
            <h2 className={styles.manageTitle}>Manage your data</h2>
            <p className={styles.manageText}>
              You stay in control. Opt out of our map at any time, or ask us to permanently
              erase everything we hold about you.
            </p>
          </div>
          <div className={styles.actions}>
            <a className={styles.actionBtn} href="mailto:contact@360crossmedia.com?subject=I want to unsubscribe from the map">
              {I.out} Unsubscribe from our map
            </a>
            <a className={styles.actionBtnDanger} href="mailto:contact@360crossmedia.com?subject=Erase all my data from your database">
              {I.trash} Erase all my data
            </a>
          </div>
        </div>

        <section className={styles.rights}>
          <h2 className={styles.h}>What are your rights?</h2>
          <p className={styles.p}>
            <strong>Access &amp; Correction.</strong> If at any point you believe the information
            we process on you is incorrect, you can update it by emailing{" "}
            <a className={styles.link} href="mailto:contact@360Crossmedia.com">contact@360Crossmedia.com</a>{" "}
            or by calling us on (+352) 356877.
          </p>
          <p className={styles.p}>
            <strong>Complaint.</strong> If you are not satisfied with our response or believe
            360CROSSMEDIA is processing your data unlawfully, you can contact our CEO, Jérôme Bloch:{" "}
            <a className={styles.link} href="mailto:jbloch@360Crossmedia.com">jbloch@360Crossmedia.com</a>{" "}
            or the CNPD (www.cnpd.lu).
          </p>
        </section>
      </div>
    </div>
  );
};

export default Gdpr;
