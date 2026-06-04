"use client";
import styles from "../styles/gdpr.module.css";

const Gdpr = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <span className={styles.eyebrow}>// Privacy</span>
        <h1 className={styles.title}>GDPR Privacy Notice</h1>

        <p className={styles.p}>
          Following the General Data Protection Regulation (GDPR) on data protection and privacy
          for all individuals within the European Union and the European Economic Area, TreasuryMap
          is addressing the handling of its contacts' personal data.
        </p>

        <p className={styles.lead}>
          <strong>Your Personal Data — Contact (definition):</strong> clients, prospects, people
          attending events for which we are partners, people connecting with our team during events
          or business meetings, people subscribing to our newsletters and magazines.
        </p>

        <h2 className={styles.h}>What we need</h2>
        <p className={styles.p}>
          360CROSSMEDIA only collects basic personal data about its contacts which includes your
          email address, name, company name, and job title as a minimum. Depending on how far you
          have completed your profile on our form, 360CROSSMEDIA might also hold information about
          your nationality, spoken languages, address and phone. If we have called you or met you,
          we sometimes save key information about our conversations in our CRM in order to serve you better.
        </p>

        <h2 className={styles.h}>Why we need it</h2>
        <p className={styles.p}>
          360CROSSMEDIA needs to know your basic personal data in order to provide you with invoices,
          newsletters, events information, invitations, magazines and special offers. We will not
          collect any personal data from you that we do not need.
        </p>

        <h2 className={styles.h}>What we do with it</h2>
        <p className={styles.p}>
          All the personal data we hold is processed in our CRM, whose servers are located in Europe.
          All our employees sign an NDA together with their contract before touching any computer. Our
          CEO is the only admin of our CRM. No third parties have access to your personal data unless
          the law requires them to do so. We never sell or provide data to any company.
        </p>

        <h2 className={styles.h}>How long we keep it</h2>
        <p className={styles.p}>
          Any information will be kept with 360CROSSMEDIA until you notify the company that you no
          longer wish 360CROSSMEDIA to keep this information. Each newsletter is sent with an "opt out"
          button (you will no longer receive the newsletter) and an "All out" button (we will erase all
          data about you in our CRM).
        </p>

        <h2 className={styles.h}>How to unsubscribe / erase your data</h2>
        <div className={styles.actions}>
          <a className={styles.actionBtn} href="mailto:contact@360crossmedia.com?subject=I want to unsubscribe from the map">
            Unsubscribe from our map
          </a>
          <a className={styles.actionBtn} href="mailto:contact@360crossmedia.com?subject=Erase all my data from your database">
            Erase all my data
          </a>
        </div>

        <h2 className={styles.h}>What are your rights?</h2>
        <p className={styles.p}>
          <strong>Access / Correction:</strong> if at any point you believe the information we process
          on you is incorrect, you can update it by emailing{" "}
          <a className={styles.link} href="mailto:contact@360Crossmedia.com">contact@360Crossmedia.com</a>{" "}
          or by calling us on (+352) 356877.
        </p>
        <p className={styles.p}>
          <strong>Complaint:</strong> if you are not satisfied with our response or believe
          360CROSSMEDIA is processing your data unlawfully, you can contact our CEO, Jérôme Bloch:{" "}
          <a className={styles.link} href="mailto:jbloch@360Crossmedia.com">jbloch@360Crossmedia.com</a>{" "}
          or the CNPD (www.cnpd.lu).
        </p>
      </div>
    </div>
  );
};

export default Gdpr;
