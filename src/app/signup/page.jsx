"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/layout.module.css";
import SignupCard from "../components/SignupCard";

const Layout = () => {
  return (
    <div className={styles.mainContainer}>
      <Navbar buttonLabel={"Login"} />
      <SignupCard />
      <Footer />
    </div>
  );
};

export default Layout;
