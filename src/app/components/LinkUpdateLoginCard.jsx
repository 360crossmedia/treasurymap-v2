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
import { setIsLoading } from "../store/slices/isLoading.slice";

const LinkUpdateLoginCard = ({emailkey}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState(`${emailkey}@admin.com`);
  const [password, setPassword] = useState('12345');



  const submit = async () => {
    dispatch(setIsLoading(true));
    const data = await apiLogin({
      email: email.toLowerCase(),
      password: password,
    });

    if (data && data.status == 200) {
      dispatch(setUser(data.data.id));
      localStorage.clear();
      localStorage.setItem("userId", data.data.id);
      dispatch(setIsLoading(false));
      router.push("/dashboard");
    } else {
      dispatch(setIsLoading(false));
      alert("Check your credentials");
    }
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
            value={email}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <a href="/restorePassword" className={styles.forgetPasswordA}>
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

export default LinkUpdateLoginCard;
