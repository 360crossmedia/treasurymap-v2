"use client";
import styles from "../styles/navbar.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import MobileMenuNavbar from "../assets/MobileMenuNavbar.svg";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCompanyId } from "../store/slices/companyToUpdate.slice";
import { setUser } from "../store/slices/user.slice";
import { clearAuth } from "../service/authToken";
import { usePathname } from "next/navigation";

// TreasuryMap brand pin · crisp vector recreation of the official mark
// (gradient teardrop + white aperture + water wave). Scales without pixelation.
const PinIcon = () => (
  <svg className={styles.logoPinSvg} viewBox="0 0 40 52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="tmPin" x1="20" y1="1" x2="20" y2="50" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2f6fe0" />
        <stop offset="1" stopColor="#19a3e6" />
      </linearGradient>
      <linearGradient id="tmWave" x1="20" y1="26" x2="20" y2="46" gradientUnits="userSpaceOnUse">
        <stop stopColor="#7fe0ea" />
        <stop offset="1" stopColor="#2db8dc" />
      </linearGradient>
      <clipPath id="tmClip">
        <path d="M20 1.6C10.9 1.6 3.5 9 3.5 18.1c0 11.6 16.5 31.9 16.5 31.9S36.5 29.7 36.5 18.1C36.5 9 29.1 1.6 20 1.6Z" />
      </clipPath>
    </defs>
    <path d="M20 1.6C10.9 1.6 3.5 9 3.5 18.1c0 11.6 16.5 31.9 16.5 31.9S36.5 29.7 36.5 18.1C36.5 9 29.1 1.6 20 1.6Z" fill="url(#tmPin)" />
    <g clipPath="url(#tmClip)">
      <path d="M0 30c5-4 10.5-4 15.5 0s11 3 16-1l9-5v34H0V30Z" fill="url(#tmWave)" opacity="0.95" />
      <path d="M0 35.5c5.5-3.5 11 1 16-1.5s10.5 2 17.5-1.5V58H0V35.5Z" fill="#d2f0f6" opacity="0.5" />
    </g>
    <circle cx="20" cy="18" r="7" fill="#fff" />
  </svg>
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

  // Red button toggles between the procedural Treasury Map (/) and the
  // hand-tuned Multiplayer Map (/multiplayer-map).
  const onMultiplayer = pathname === "/multiplayer-map";
  const redLabel = () => {
    if (isDesktop) return onMultiplayer ? "Treasury Map" : "Multiplayer Map";
    return onMultiplayer ? "TM" : "MP";
  };
  const onRedClick = () => router.push(onMultiplayer ? "/" : "/multiplayer-map");

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
              <>
                <a className={styles.navbarA} href="/dashboard">Admin Dashboard</a>
                <span className={styles.linkSep} />
              </>
            )}
            <a className={styles.navbarA} href="/contactUs">Contact us</a>
            <span className={styles.linkSep} />
            <a className={styles.navbarA} href="/insights">Insights</a>

            {/* Make my Selection · highlighted (new AI tool, points to Long List) */}
            <a className={styles.makeSelection} href="/get-my-list">
              <span className={styles.newDot} />
              Build my shortlist
            </a>
          </div>
        </div>

        {/* ── Right CTAs ── */}
        <div className={styles.navbarRight}>
          <span className={styles.ctaSep} />

          <button
            onClick={onRedClick}
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
                  clearAuth();
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
