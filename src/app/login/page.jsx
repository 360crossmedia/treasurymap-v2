"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/layout.module.css";
import LoginCard from "../components/LoginCard";

const Layout = () => {
  return (
    <div className={styles.mainContainer}>
      <Navbar buttonLabel={"Sign up"} />
      <LoginCard />
      <Footer />
    </div>
  );
};

export default Layout;
