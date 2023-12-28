"use client";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import styles from "./styles/layout.module.css";

const Layout = () => {
  return (
    <div
      className={styles.mainContainer}
      style={{ backgroundPosition: "bottom", paddingTop: 0 }}
    >
      <div className={styles.mainContainerMap}>
        <Navbar buttonLabel={"Sign up"} />
      </div>
      <iframe
        src="https://test-manuelnacer.web.app/"
        className={styles.map}
      ></iframe>
      <Footer />
    </div>
  );
};

export default Layout;
