"use client";
import styles from "../styles/loginCard.module.css";
import Image from "next/image";
import inputEmailIcon from "../assets/inputEmailIcon.svg";
import inputPasswordIcon from "../assets/inputPasswordIcon.svg";
import { useState } from "react";
import { apiLogin } from "../service/apiLogin";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/user.slice";

const LoginCard = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const submit = async () => {
    const data = await apiLogin({ email, password });

    if (data && data.status == 200) {
      dispatch(setUser(data.data.id));
      router.push("/dashboard");
    } else alert("Check your credentials");
  };

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
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <div className={styles.inputContainer}>
            <Image className={styles.icon} src={inputPasswordIcon} alt="" />
            <input
              className={styles.input}
              placeholder="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <a href="#" className={styles.forgetPasswordA}>
            Forget password?
          </a>
        </div>
        <div>
          <button onClick={submit} className={styles.button}>
            Log in
          </button>
        </div>
        <div>
          <p className={styles.signUpButton}>
            Don’t have account?{" "}
            <a className={styles.signUpButton} href="/signup">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
