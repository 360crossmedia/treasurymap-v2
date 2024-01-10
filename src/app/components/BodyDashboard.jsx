"use client";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/BodyDashboard.module.css";
import { useRouter } from "next/navigation";
import { setCompanyId } from "../store/slices/companyToUpdate.slice";

const BodyDashboard = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const companyId = useSelector((state) => state.companyId);

  return (
    <div className={styles.mainContainer}>
      <div>
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
