"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/signupCard.module.css";
import Image from "next/image";
import inputEmailIcon from "../assets/inputEmailIcon.svg";
import inputPasswordIcon from "../assets/inputPasswordIcon.svg";
import inputFullNameIcon from "../assets/person.svg";
import inputCompanyNameIcon from "../assets/building.svg";
import { apiCreateUser } from "../service/apiCreateUser";
import { useDispatch } from "react-redux";
import { setIsLoading } from "../store/slices/isLoading.slice";

const SignupCard = () => {
  const [companyName, setcompanyName] = useState("");
  const [fullName, setfullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setconfPassword] = useState("");
  const [passwordMatch, setPasswordsMatch] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    checkPasswordsMatch(e.target.value, confPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setconfPassword(e.target.value);
    checkPasswordsMatch(password, e.target.value);
  };

  const checkPasswordsMatch = (pwd1, pwd2) => {
    setPasswordsMatch(pwd1 === pwd2);
  };

  const handleSubmit = async () => {
    if (
      !companyName.length ||
      !fullName.length ||
      !email.length ||
      !password.length ||
      !confPassword.length
    ) {
      return setError("Complete information");
    } else if (!email.includes("@") || !email.includes(".")) {
      return setError("Enter valid email");
    } else if (!passwordMatch) {
      return setError("Password doesn't match");
    } else {
      dispatch(setIsLoading(true));
      let datos = {
        companyName: companyName.toLowerCase(),
        fullName: fullName.toLowerCase(),
        email: email.toLowerCase(),
        password: password.toLowerCase(),
      };

      try {
        setError("");
        let data = await apiCreateUser(datos);

        if (data == 201) {
          dispatch(setIsLoading(false));
          router.push("/login");
        } else {
          dispatch(setIsLoading(false));
          setError("No se puede crear usuario, información incorrecta");
          console.log(data);
        }
      } catch (e) {
        dispatch(setIsLoading(false));
        setError("No se puede crear usuario, información incorrecta");
        console.log(e);
      }
    }
  };

  return (
    <div className={styles.cardContainer}>
      <div className={styles.card}>
        <div>
          <p className={styles.cardDescription}>Welcome to Treasury MAP</p>
          <p
            style={{
              color: "#626b80",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Contact us if you feel that your company should be on the map:
            contact@360Crossmedia.com
          </p>

          <hr style={{ borderTop: "1px dashed" }} />
          <p className={styles.cardDescription}>Sign Up</p>
          <p
            style={{
              color: "#626b80",
              textAlign: "center",
              fontSize: "smaller",
            }}
          >
            Once we have validated the presence of your company on the map by
            email, you can set-up your account below.
          </p>
        </div>
        <div className={styles.inputContainer}>
          <Image className={styles.icon} src={inputCompanyNameIcon} alt="" />
          <input
            className={styles.input}
            placeholder="Company Name"
            type="text"
            value={companyName}
            onChange={(e) => setcompanyName(e.target.value)}
          />
        </div>
        <div className={styles.inputContainer}>
          <Image className={styles.icon} src={inputFullNameIcon} alt="" />
          <input
            className={styles.input}
            placeholder="Full Name"
            type="text"
            value={fullName}
            onChange={(e) => setfullName(e.target.value)}
          />
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
        <div className={styles.inputContainer}>
          <Image className={styles.icon} src={inputPasswordIcon} alt="" />
          <input
            className={styles.input}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => handlePasswordChange(e)}
          />
        </div>
        <div className={styles.inputContainer}>
          <Image className={styles.icon} src={inputPasswordIcon} alt="" />
          <input
            className={styles.input}
            placeholder="Confirm Password"
            type="password"
            value={confPassword}
            onChange={(e) => handleConfirmPasswordChange(e)}
          />
        </div>
        <div>
          <button className={styles.button} onClick={handleSubmit}>
            Sign up
          </button>
          {!!error.length && <p className={styles.error}>Error: {error}</p>}
        </div>
      </div>
    </div>
  );
};

export default SignupCard;
