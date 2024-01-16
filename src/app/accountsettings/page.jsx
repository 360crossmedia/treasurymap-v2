"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/layout.module.css";
import AccountsSettingsCard from "../components/AccountsSettingsCard";

const Layout = () => {
  return (
    <div className={styles.mainContainer}>
      <Navbar buttonLabel={"Login"} />
      <AccountsSettingsCard />
      <Footer />
    </div>
  );
};

export default Layout;
