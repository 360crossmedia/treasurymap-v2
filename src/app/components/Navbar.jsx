"use client";
import styles from "../styles/navbar.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import MobileMenuNavbar from "../assets/MobileMenuNavbar.svg";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCompanyId } from "../store/slices/companyToUpdate.slice";
import { setUser } from "../store/slices/user.slice";
import { usePathname } from "next/navigation";

const PinIcon = () => (
  <span className={styles.logoPin}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 22s7-6.2 7-12A7 7 0 0 0 5 10c0 5.8 7 12 7 12Z"/>
      <circle cx="12" cy="10" r="2.3" fill="#fff"/>
    </svg>
  </span>
);

const Navbar = ({ buttonLabel, multiplayerMap, set, rotate }) => {
  const pathname = usePathname();
  const router   = useRouter();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loggedIn,   setLoggedIn]   = useState(undefined);
  const [isDesktop,  setIsDesktop]  = useState();

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("userId"));
  }, []);

  useEffect(() => {
    const fn = () => setIsDesktop(window.innerWidth >= 1140);
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const redLabel = () => {
    if (isDesktop) return !multiplayerMap ? "Treasury Map" : "Multiplayer Map";
    return !multiplayerMap ? "TM" : "MP";
  };

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>

        {/* ── Mobile hamburger ── */}
        <div className={styles.logoNavbar}>
          <Image
            className={styles.MobileMenuNavbar}
            src={MobileMenuNavbar} alt="menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
        </div>

        {/* ── Logo ── */}
        <div className={styles.navbarLeft}>
          <div className={styles.logoMark} onClick={() => router.push("/")}>
            <span className={styles.logoTreasury}>Treasury</span>
            <span className={styles.logoMap}>MAP</span>
            <PinIcon />
          </div>

          {/* ── Nav links ── */}
          <div className={`${styles.navbarLinks} ${isMenuOpen ? styles.navbarLinksMobile : ""}`}>
            {loggedIn && (
              <a className={styles.navbarA} href="/dashboard">Admin Dashboard</a>
            )}
            <a className={styles.navbarA} href="/contactUs">Contact us</a>
            <a className={styles.navbarA} href="/insights">Insights</a>

            {/* Make my Selection — highlighted (new AI tool, points to Long List) */}
            <a className={styles.makeSelection} href="/get-my-list">
              <span className={styles.newDot} />
              Make my Selection
            </a>
          </div>
        </div>

        {/* ── Right CTAs ── */}
        <div className={styles.navbarRight}>
          <span className={styles.ctaSep} />

          <button
            onClick={() => { if (set) rotate(); else router.push("/"); }}
            className={styles.redButton}
          >
            <span className={styles.spanButton}>{redLabel()}</span>
          </button>

          {loggedIn !== undefined && (
            loggedIn ? (
              <button
                onClick={() => {
                  dispatch(setCompanyId(false));
                  dispatch(setUser(0));
                  localStorage.removeItem("userId");
                  localStorage.removeItem("companyId");
                  pathname === "/" ? window.location.reload() : router.push("/");
                }}
                className={styles.navbarButtonLogOut}
              >
                Log Out
              </button>
            ) : (
              <button
                onClick={() => buttonLabel === "Sign up" ? router.push("/signup") : router.push("/login")}
                className={styles.navbarButton}
              >
                {buttonLabel}
              </button>
            )
          )}
        </div>

      </nav>
    </header>
  );
};

export default Navbar;
