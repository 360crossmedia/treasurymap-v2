"use client";
import styles from "../styles/navbar.module.css";
import navbarlogo from "../assets/navbarlogo.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Navbar = ({ buttonLabel }) => {
  const router = useRouter();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <Image src={navbarlogo} alt="logo" />
        <div className={styles.navbarLinks}>
          <a className={styles.navbarA} href="#">
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
