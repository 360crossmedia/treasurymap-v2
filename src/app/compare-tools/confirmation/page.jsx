"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import styles from "../../get-my-list/styles.module.css";

function ConfirmationInner() {
  const sp = useSearchParams();
  const email = sp.get("email") || "";
  const id = sp.get("id");

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.confirmCard}>
          <div className={styles.confirmIcon}>📊</div>
          <h1 className={styles.confirmTitle}>Your comparison is on its way</h1>
          <p className={styles.confirmText}>We are generating your vendor comparison right now.</p>
          <p className={styles.confirmText}>
            It will be sent to{" "}
            <span className={styles.confirmEmail}>{email || "your email"}</span> in a few minutes.
          </p>
          <p className={styles.confirmHint}>
            If you don't see it after 10 minutes, check your spam folder. Generation typically takes
            2 to 3 minutes for a comparison.
          </p>
          {id && <p className={styles.confirmHint}>Reference: #{id}</p>}
          <a href="/" className={styles.confirmHomeLink}>
            ← Back to TreasuryMap
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <div>
      <Navbar buttonLabel={"Login"} />
      <Suspense fallback={<div style={{ minHeight: "60vh" }} />}>
        <ConfirmationInner />
      </Suspense>
      <Footer />
    </div>
  );
}
