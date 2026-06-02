"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ConfirmationStatus from "../../components/ConfirmationStatus";
import styles from "../styles.module.css";

function ConfirmationInner() {
  const sp    = useSearchParams();
  const email = sp.get("email") || "";
  const id    = sp.get("id");

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <ConfirmationStatus id={id} email={email} type="longlist" />
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <div>
      <Navbar buttonLabel="Log In" />
      <Suspense fallback={<div style={{ minHeight: "60vh" }} />}>
        <ConfirmationInner />
      </Suspense>
      <Footer />
    </div>
  );
}
