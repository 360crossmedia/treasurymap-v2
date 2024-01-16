"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/layout.module.css";
import MyAccountCard from "../components/MyAccountCard";

const Layout = () => {
  return (
    <div className={styles.mainContainer}>
      <Navbar buttonLabel={"Login"} />
      <MyAccountCard />
      <Footer />
    </div>
  );
};

export default Layout;
