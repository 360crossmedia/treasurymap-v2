"use client";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import styles from "../../styles/layout.module.css";
import RestorePasswordCard from "../../components/RestorePasswordCard";

const Layout = ({ params }) => {
  return (
    <div className={styles.mainContainer}>
      <Navbar buttonLabel={"Sign up"} />
      <RestorePasswordCard token={params.token} />
      <Footer />
    </div>
  );
};

export default Layout;
