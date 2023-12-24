"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/layout.module.css";
import ContactUs from "../components/ContactUs";

const Layout = () => {
  return (
    <div className={styles.mainContainer}>
      <Navbar buttonLabel={"Login"} />
      <ContactUs />
      <Footer />
    </div>
  );
};

export default Layout;
