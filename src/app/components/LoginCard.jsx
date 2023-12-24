"use client";
import styles from "../styles/loginCard.module.css";
import Image from "next/image";
import inputEmailIcon from "../assets/inputEmailIcon.svg";
import inputPasswordIcon from "../assets/inputPasswordIcon.svg";

const LoginCard = () => {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.card}>
        <div>
          <p className={styles.cardTitle}>Hello Again!</p>
          <p className={styles.cardDescription}>Welcome Back</p>
        </div>
        <div className={styles.inputContainer}>
          <Image className={styles.icon} src={inputEmailIcon} alt="" />
          <input
            className={styles.input}
            placeholder="Email Address"
            type="text"
          />
        </div>
        <div>
          <div className={styles.inputContainer}>
            <Image className={styles.icon} src={inputPasswordIcon} alt="" />
            <input
              className={styles.input}
              placeholder="Password"
              type="text"
            />
          </div>
          <a href="#" className={styles.forgetPasswordA}>
            Forget password?
          </a>
        </div>
        <div>
          <button className={styles.button}>Log in</button>
        </div>
        <div>
          <p className={styles.signUpButton} href="#">
            Don’t have account?{" "}
            <a className={styles.signUpButton} href="#">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
