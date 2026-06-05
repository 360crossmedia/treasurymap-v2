"use client";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import styles from "../../styles/layout.module.css";
import LinkUpdateLoginCard from "@/app/components/LinkUpdateLoginCard";

const Layout = ({ params }) => {
  // The route segment (historically named "emailkey") now carries the signed
  // magic-link token. Pass it straight through; the card verifies it server-side.
  return (
    <div className={styles.mainContainer}>
      <Navbar buttonLabel={"Sign up"} />
      <LinkUpdateLoginCard token={params.emailkey} />
      <Footer />
    </div>
  );
};

export default Layout;
