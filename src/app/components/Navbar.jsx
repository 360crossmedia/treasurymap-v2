"use client";
import styles from "../styles/navbar.module.css";
import navbarlogo from "../assets/navbarlogo.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MobileMenuNavbar from "../assets/MobileMenuNavbar.svg";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCompanyId } from "../store/slices/companyToUpdate.slice";
import { setUser } from "../store/slices/user.slice";
import { usePathname } from "next/navigation";

const Navbar = ({ buttonLabel }) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(undefined);

  useEffect(() => {
    let userFound = localStorage.getItem("userId");
    if (userFound) {
      setLoggedIn(true);
      //console.log('TRUE it is logged');
    } else {
      setLoggedIn(false);
      //console.log('Not logged in');
    }
  }, []);

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
          {loggedIn ? (
            <a className={styles.navbarA} href="/dashboard">
              Admin Dashboard
            </a>
          ) : (
            <a className={styles.navbarA} href="/signup">
              Be on the map
            </a>
          )}

          <a className={styles.navbarA} href="/contactUs">
            Contact us
          </a>
          <a className={styles.navbarA} href="/insights">
            Insights
          </a>
        </div>
      </div>
      <div className={styles.navbarRight}>
        {loggedIn !== undefined &&
          (loggedIn ? (
            <button
              onClick={() => {
                dispatch(setCompanyId(false));
                dispatch(setUser(0));
                localStorage.removeItem("userId");
                localStorage.removeItem("companyId");

                if (pathname === "/") {
                  window.location.reload();
                } else {
                  router.push("/");
                }
              }}
              className={styles.navbarButtonLogOut}
            >
              Log Out
            </button>
          ) : (
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
          ))}
      </div>
    </nav>
  );
};

export default Navbar;
