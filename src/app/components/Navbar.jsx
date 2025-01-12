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

const Navbar = ({ buttonLabel, multiplayerMap, set, rotate }) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(undefined);
  const [isDesktop, setIsDesktop] = useState();

  useEffect(() => {
    let userFound = localStorage.getItem("userId");
    if (userFound) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1140);
    };
    handleResize();
  }, []);

  const redButtonLabel = (isDesktop, multiplayerMap) => {
    if (isDesktop) {
      if (multiplayerMap) return "Treasury Map";
      else return "Multiplayer Map";
    } else {
      if (multiplayerMap) return "TM";
      else return "MP";
    }
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.logoNavbar}>
          <Image
            className={styles.MobileMenuNavbar}
            src={MobileMenuNavbar}
            alt="logo"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              console.log(isMenuOpen);
            }}
          />
        </div>
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
          <button
            onClick={() => {
              if (set) {
                set(!multiplayerMap);
                rotate();
              } else router.push("/");
            }}
            className={styles.redButton}
          >
            <span className={styles.spanButton}>
              {redButtonLabel(isDesktop, multiplayerMap)}
            </span>
          </button>
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
      <button
        onClick={() => router.push("/insights")}
        className={styles.insightsButton}
      >
        Go to Insights Page
      </button>
    </>
  );
};

export default Navbar;
