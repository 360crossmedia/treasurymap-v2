"use client";
import styles from "../styles/Gpdr.module.css";

const Gdpr = () => {
  return (
    <div className={styles.mainContainer}>
      <h1 className={styles.title}>GDPR Privacy Notice</h1>
      <p>
        Following the General Data Protection Regulation (GDPR){" "}
        <a
          className={styles.link}
          href="https://en.wikipedia.org/wiki/Regulation_(European_Union)"
        >
          regulation
        </a>{" "}
        on{" "}
        <a
          className={styles.link}
          href="https://en.wikipedia.org/wiki/Data_protection"
        >
          data protection
        </a>{" "}
        and privacy for all individuals within the{" "}
        <a
          className={styles.link}
          href="https://en.wikipedia.org/wiki/European_Union"
        >
          {" "}
          European Union
        </a>{" "}
        and the{" "}
        <a
          className={styles.link}
          href="https://en.wikipedia.org/wiki/European_Economic_Area"
        >
          European Economic Area
        </a>
        , Treasury Map is addressing the handling of its contacts personal data.
      </p>
      <p className={styles.strong}>
        Your Personal Data: <br />
        Contact (definition): clients, prospects, people attending events for
        which we are partners, people connecting with our team during events or
        business meetings, people subscribing to our newsletters and magazines.
      </p>
      <h6 className={styles.strong}>What we need</h6>
      <p>
        360CROSSMEDIA only collects basic personal data about its contacts which
        includes your Email address, name, company name, and job title as a
        minimum. Depending on how far you have completed your profile on our
        form, 360CROSSMEDIA might also hold information about your nationality,
        spoken languages, address, phone. If we have called you or met you, we
        sometimes save key information about our conversations in our CRM in
        order to serve you better.
      </p>
      <h6 className={styles.strong}>Why we need it</h6>
      <p>
        360CROSSMEDIA needs to know your basic personal data in order to provide
        you with invoices, newsletters, events information, invitations,
        magazines, special offers. We will not collect any personal data from
        you that we do not need in order to provide and oversee this service to
        you.
      </p>
      <h6 className={styles.strong}>What we do with it</h6>
      <p>
        All the personal data we hold is processed in our CRM for which servers
        are located in Europe. All our employees sign an NDA together with their
        contract before touching any computer. Our CEO is the only admin of our
        CRM. No third parties have access to your personal data unless the law
        requires them to do so. We never sell or provide data to any company. A
        limited number of employees have access to the CRM.
      </p>
      <h6 className={styles.strong}>How long we keep it</h6>
      <p>
        Any information will be kept with 360CROSSMEDIA until you notify the
        company that you no longer wish 360CROSSMEDIA to keep this information.
        Each newsletter is sent not only with an “opt out” button (you will no
        longer receive the newsletter), but also with an “All out” button,
        meaning that we will erase all data about you in our CRM.
      </p>
      <h6 className={styles.strong}>How to unsubscribe / Erase your data?</h6>
      <p>You can click on the following links to request:</p>
      <ul>
        <li>
          <a
            className={styles.link}
            href="mailto:contact@360crossmedia.com?subject=I want to unsubscribe from the map"
          >
            Unsubscribe from our map
          </a>{" "}
        </li>
        <a
          className={styles.link}
          href="mailto:contact@360crossmedia.com?subject=Erase all my data from your database"
        >
          Erase all my data from the 360Crossmedia database
        </a>
      </ul>
      <h6 className={styles.strong}>What are your rights?</h6>
      <p>
        <strong>Access/Correction: </strong>If at any point you believe the
        information we process on you is incorrect, you can update it by sending
        us an email to{" "}
        <a className={styles.link} href="mailto:contact@360Crossmedia.com">
          contact@360Crossmedia.com
        </a>{" "}
        or by calling us (+352) 356877.
      </p>
      <p>
        <strong>Complaint:</strong> If you are not satisfied with our response
        or believe 360CROSSMEDIA is processing your data not in accordance with
        the law, you can contact our CEO, Jerome Bloch:{" "}
        <a className={styles.link} href="mailto:jbloch@360Crossmedia.com">
          jbloch@360Crossmedia.com
        </a>{" "}
        or CNPD (www.CNPD.lu)
      </p>
    </div>
  );
};

export default Gdpr;
