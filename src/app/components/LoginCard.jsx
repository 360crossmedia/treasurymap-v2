"use client";
import { useState } from "react";
import styles from "../styles/auth.module.css";
import { apiLogin } from "../service/apiLogin";
import { setAuthToken } from "../service/authToken";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/user.slice";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MailIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
);
const LockIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);

const LoginCard = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = "Please enter your email";
    else if (!EMAIL_RE.test(email)) e.email = "Please enter a valid email";
    if (!password) e.password = "Please enter your password";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setBanner("");
    if (loading || !validate()) return;
    setLoading(true);
    try {
      const data = await apiLogin({ email: email.toLowerCase().trim(), password });
      if (data && data.status === 200) {
        dispatch(setUser(data.data.id));
        localStorage.clear();
        localStorage.setItem("userId", data.data.id);
        setAuthToken(data.data.token);
        router.push("/dashboard");
      } else {
        setBanner("Incorrect email or password. Please try again.");
        setLoading(false);
      }
    } catch {
      setBanner("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <form className={styles.card} onSubmit={submit} noValidate>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Log in to your TreasuryMap account.</p>

        {banner && <div className={`${styles.banner} ${styles.bannerError}`}>{banner}</div>}

        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <div className={`${styles.inputWrap} ${errors.email ? styles.err : ""}`}>
            <span className={styles.icon}><MailIcon /></span>
            <input className={styles.input} type="email" placeholder="you@company.com"
              value={email} onChange={(e) => { setEmail(e.target.value); setErrors((x) => ({ ...x, email: undefined })); }} />
          </div>
          {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Password</label>
          <div className={`${styles.inputWrap} ${errors.password ? styles.err : ""}`}>
            <span className={styles.icon}><LockIcon /></span>
            <input className={styles.input} type="password" placeholder="••••••••"
              value={password} onChange={(e) => { setPassword(e.target.value); setErrors((x) => ({ ...x, password: undefined })); }} />
          </div>
          {errors.password && <span className={styles.errorMsg}>{errors.password}</span>}
        </div>

        <div className={styles.row}>
          <a href="/restorePassword" className={styles.link}>Forgot password?</a>
        </div>

        <button type="submit" className={styles.button} disabled={loading}>
          {loading && <span className={styles.spinner} />}
          {loading ? "Logging in…" : "Log in"}
        </button>

        <p className={styles.alt}>
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </form>
    </div>
  );
};

export default LoginCard;
