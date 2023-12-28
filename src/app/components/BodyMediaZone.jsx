"use client";
import styles from "../styles/BodyDashboard.module.css";
import styles2 from "../styles/BodyMediaZone.module.css";

const BodyMediaZone = () => {
  return (
    <div className={`${styles.mainContainer} ${styles2.mainContainer}`}>
      <div className={styles2.buttonsContainer}>
        <button className={`${styles.mediaZoneButton} ${styles2.updateButton}`}>
          Update
        </button>
        <button className={styles2.deleteButton}>Delete</button>
      </div>
      <div className={styles.linesContainer}>
        <div className={styles.line}></div>
        <p className={styles.or}>Or</p>
        <div className={styles.line}></div>
      </div>
      <div>
        <div className={`${styles2.videosList} ${styles2.headerList}`}>
          <p className={styles2.headerP}>Title Of Video</p>
          <p className={styles2.headerP}>Creation Date</p>
        </div>
        <div className={`${styles2.videosList} ${styles2.middle}`}>
          <p className={styles2.videoP}>
            FIDP (Financial Instrument Dealing Platform)
          </p>
          <p className={styles2.videoP}>2023/12/22</p>
        </div>
        <div className={styles2.videosList}>
          <p className={styles2.videoP}>
            FIDP (Financial Instrument Dealing Platform)
          </p>
          <p className={styles2.videoP}>2023/12/22</p>
        </div>
      </div>
    </div>
  );
};

export default BodyMediaZone;
