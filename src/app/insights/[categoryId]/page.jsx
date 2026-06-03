"use client";
import { use } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import InsightsNavbar from "../../components/InsightsNavbar";
import InsightsWithCategory from "../../components/InsightsWithCategory";
import styles from "../../styles/Insights.module.css";

export default function InsightsCategoryPage({ params }) {
  const { categoryId } = use(params);
  return (
    <>
      <Navbar buttonLabel="Log In" />
      <div className={styles.page}>
        <header className={styles.header}>
          <span className={styles.eyebrow}>// Insights</span>
          <h1 className={styles.heading}>Treasury technology insights</h1>
        </header>
        <InsightsNavbar categoryId={categoryId} />
        <InsightsWithCategory categoryId={categoryId} />
      </div>
      <Footer />
    </>
  );
}
