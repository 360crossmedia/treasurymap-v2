"use client";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import styles from "../../styles/layout.module.css";
import InsightsNavbar from "@/app/components/InsightsNavbar";
import InsightsWithCategory from "@/app/components/InsightsWithCategory";
import { use } from "react";

const Layout = ({ params }) => {
  const { categoryId } = use(params);
  return (
    <>
      <div
        className={styles.mainContainer}
        style={{ backgroundPosition: "bottom", paddingBottom: "1.65%" }}
      >
        <Navbar buttonLabel={"Login"} />
        <InsightsNavbar categoryId={categoryId} />
        <InsightsWithCategory categoryId={categoryId} />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
