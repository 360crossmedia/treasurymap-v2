"use client";
import { useSelector } from "react-redux";
import styles from "../styles/BodyDashboard.module.css";
import { useRouter } from "next/navigation";

const BodyDashboard = () => {
  const router = useRouter();
  const companyId = useSelector((state) => state.companyId);
  return (
    <div className={styles.mainContainer}>
      <div>
        <button
          onClick={() =>
            companyId
              ? router.push("/mediaZone")
              : alert("Please select any company")
          }
          className={styles.mediaZoneButton}
        >
          Media Zone
        </button>
      </div>
      <div className={styles.linesContainer}>
        <div className={styles.line}></div>
        <p className={styles.or}>Or</p>
        <div className={styles.line}></div>
      </div>
      <div>
        <button
          onClick={() => router.push("/form")}
          className={styles.createCompanyButton}
        >
          Create a new company
        </button>
      </div>
    </div>
  );
};

export default BodyDashboard;
