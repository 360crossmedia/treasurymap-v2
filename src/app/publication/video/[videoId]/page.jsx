"use client";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import styles from "../../../styles/layout.module.css";
import InsightsNavbar from "@/app/components/InsightsNavbar";
import Video from "@/app/components/Video";
import { use } from "react";

const Layout = ({ params }) => {
  const { videoId } = use(params);
  return (
    <>
      <div
        className={styles.mainContainer}
        style={{ backgroundPosition: "bottom", paddingBottom: "1.65%" }}
      >
        <Navbar buttonLabel={"Login"} />
        <InsightsNavbar />
        <Video videoId={videoId} />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
