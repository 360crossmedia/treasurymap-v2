"use client";
import styles from "../styles/navbar.module.css";
import navbarlogo from "../assets/navbarlogo.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MobileMenuNavbar from "../assets/MobileMenuNavbar.svg";
import { useState } from "react";

const Navbar = ({ buttonLabel }) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <Image
        className={styles.MobileMenuNavbar}
        src={MobileMenuNavbar}
        alt="logo"
        onClick={() => {
          setIsMenuOpen(!isMenuOpen);
          console.log(isMenuOpen);
        }}
      />
      <div className={styles.navbarLeft}>
        <Image
          className={styles.navbarLogo}
          onClick={() => router.push("/")}
          src={navbarlogo}
          alt="logo"
        />
        <div
          className={`${styles.navbarLinks} ${
            isMenuOpen ? styles.navbarLinksMobile : ""
          }`}
        >
          <a className={styles.navbarA} href="/">
            Be on the map
          </a>
          <a className={styles.navbarA} href="/contactUs">
            Contact us
          </a>
        </div>
      </div>
      <div className={styles.navbarRight}>
        <button
          onClick={() =>
            buttonLabel == "Sign up"
              ? router.push("/signup")
              : router.push("/login")
          }
          className={styles.navbarButton}
        >
          {buttonLabel}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
