"use client";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/BodyDashboard.module.css";
import { useRouter } from "next/navigation";
import { setCompanyId } from "../store/slices/companyToUpdate.slice";
import { useEffect } from "react";

const BodyDashboard = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const companyId = useSelector((state) => state.companyId);
  const user = useSelector((state) => state.user);
  let backUpUserId;
  const userId = user ? user : backUpUserId;

  useEffect(() => {
    if (typeof window !== "undefined") {
      backUpUserId = localStorage.getItem("userId");
    }
  }, []);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.buttonsContainer}>
        <button
          onClick={() =>
            router.push(userId != 1 ? "/myaccount" : "/accountsettings")
          }
          className={`${styles.mediaZoneButton} ${styles.colorWhite}`}
        >
          {userId != 1 ? "My Account" : "Accounts settings"}
        </button>
        <button
          onClick={() => {
            companyId
              ? router.push("/mediaZone")
              : alert("Please select any company");
            localStorage.setItem("companyId", companyId);
          }}
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
          onClick={() => {
            localStorage.removeItem("companyId");
            dispatch(setCompanyId(false));
            router.push("/form");
          }}
          className={styles.createCompanyButton}
        >
          Create a new company
        </button>
      </div>
    </div>
  );
};

export default BodyDashboard;
