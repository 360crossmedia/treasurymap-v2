"use client";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/BodyDashboard.module.css";
import { useRouter } from "next/navigation";
import { setCompanyId } from "../store/slices/companyToUpdate.slice";
import { useEffect, useState } from "react";

const BodyDashboard = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const companyId = useSelector((state) => state.companyId);
  const userId = useSelector((state) => state.user);
  const [backUpUserId, setBackUpUserId] = useState();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBackUpUserId(Number(localStorage.getItem("userId")));
    }
  }, []);

  return (
    <div className={styles.mainContainer}>
      <div
        className={
          userId == 1 || backUpUserId == 1
            ? `${styles.buttonsContainer}`
            : `${styles.buttonsContainer} ${styles.buttonsContainerOwner}`
        }
      >
        <button
          onClick={() =>
            router.push(
              userId == 1 || backUpUserId == 1
                ? "/accountsettings"
                : "/myaccount"
            )
          }
          className={`${styles.mediaZoneButton} ${styles.colorWhite}`}
        >
          {userId == 1 || backUpUserId == 1
            ? "Accounts settings"
            : "My Account"}
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
      {(userId == 1 || backUpUserId == 1) && (
        <>
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
        </>
      )}
    </div>
  );
};

export default BodyDashboard;
