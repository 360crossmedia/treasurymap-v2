"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/layout.module.css";
import InsightsNavbar from "@/app/components/InsightsNavbar";
import Insights from "../components/Insights";

const Layout = () => {
  return (
    <>
      <div
        className={styles.mainContainer}
        style={{ backgroundPosition: "bottom", paddingBottom: "1.65%" }}
      >
        <Navbar buttonLabel={"Login"} />
        <InsightsNavbar />
        <Insights />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
