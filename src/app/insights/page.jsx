"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import InsightsNavbar from "../components/InsightsNavbar";
import Insights from "../components/Insights";
import styles from "../styles/Insights.module.css";

export default function InsightsPage() {
  return (
    <>
      <Navbar buttonLabel="Log In" />
      <div className={styles.page}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>// Insights</span>
          <h1 className={styles.heading}>Treasury technology insights</h1>
          <p className={styles.sub}>Articles, videos and research from the TreasuryMap community.</p>
        </header>
        <InsightsNavbar />
        <Insights />
      </div>
      <Footer />
    </>
  );
}
