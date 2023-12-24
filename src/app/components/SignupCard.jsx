"use client";
import styles from "../styles/signupCard.module.css";
import Image from "next/image";
import inputEmailIcon from "../assets/inputEmailIcon.svg";
import inputPasswordIcon from "../assets/inputPasswordIcon.svg";

const SignupCard = () => {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.card}>
        <div>
          <p className={styles.cardTitle}>Sign Up</p>
          <p className={styles.cardDescription}>Welcome to Treasury MAP</p>
        </div>
        <div className={styles.inputContainer}>
          <Image className={styles.icon} src={inputEmailIcon} alt="" />
          <input
            className={styles.input}
            placeholder="Company Name"
            type="text"
          />
        </div>
        <div className={styles.inputContainer}>
          <Image className={styles.icon} src={inputEmailIcon} alt="" />
          <input className={styles.input} placeholder="Full Name" type="text" />
        </div>
        <div className={styles.inputContainer}>
          <Image className={styles.icon} src={inputEmailIcon} alt="" />
          <input
            className={styles.input}
            placeholder="Email Address"
            type="text"
          />
        </div>
        <div className={styles.inputContainer}>
          <Image className={styles.icon} src={inputPasswordIcon} alt="" />
          <input className={styles.input} placeholder="Password" type="text" />
        </div>
        <div className={styles.inputContainer}>
          <Image className={styles.icon} src={inputPasswordIcon} alt="" />
          <input
            className={styles.input}
            placeholder="Confirm Password"
            type="text"
          />
        </div>
        <div>
          <button className={styles.button}>Sign in</button>
        </div>
      </div>
    </div>
  );
};

export default SignupCard;
