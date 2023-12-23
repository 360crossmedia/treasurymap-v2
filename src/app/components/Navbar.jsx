"use client";
import styles from "../styles/navbar.module.css";
import navbarlogo from "../assets/navbarlogo.svg";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <Image src={navbarlogo} alt="logo" />
        <div className={styles.navbarLinks}>
          <a className={styles.navbarA} href="#">
            Be on the map
          </a>
          <a className={styles.navbarA} href="#">
            Contact us
          </a>
        </div>
      </div>
      <div className={styles.navbarRight}>
        <button className={styles.navbarButton}>Login</button>
      </div>
    </nav>
  );
};

export default Navbar;
