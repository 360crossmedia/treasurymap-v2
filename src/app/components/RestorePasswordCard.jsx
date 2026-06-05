"use client";
import { useState } from "react";
import styles from "../styles/auth.module.css";
import { useRouter } from "next/navigation";
import { apiRestorePassword } from "../service/apiRestorePassword";
import { apiResetPassword } from "../service/apiResetPassword";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MailIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
);
const LockIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
const CheckIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
);

const RestorePasswordCard = ({ token }) => {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [banner, setBanner]     = useState(null); // {type, text}
  const [done, setDone]         = useState(null); // "email" | "updated"
  const [loading, setLoading]   = useState(false);
  const [err, setErr]           = useState({});

  // The presence of a token (from the reset link) selects the "set new
  // password" mode; the token itself is validated server-side on submit.
  const hasToken = !!token;

  const submit = async (ev) => {
    ev.preventDefault();
    setBanner(null);
    if (loading) return;

    if (!hasToken) {
      if (!email.trim() || !EMAIL_RE.test(email)) { setErr({ email: "Please enter a valid email" }); return; }
      setLoading(true);
      try {
        const res = await apiRestorePassword(email.toLowerCase().trim());
        if (res?.status === 200) setDone("email");
        else setBanner({ type: "error", text: "We couldn't find an account with that email." });
      } catch { setBanner({ type: "error", text: "Something went wrong. Please try again." }); }
      setLoading(false);
      return;
    }

    // reset flow
    const e = {};
    if (password.length < 6) e.password = "Use at least 6 characters";
    if (password !== password2) e.password2 = "Passwords don't match";
    setErr(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    try {
      const res = await apiResetPassword(token, password);
      if (res?.status === 200) setDone("updated");
      else if (res?.status === 401)
        setBanner({ type: "error", text: "This reset link is invalid or has expired. Please request a new one." });
      else setBanner({ type: "error", text: "Couldn't update your password. Please try again." });
    } catch { setBanner({ type: "error", text: "Something went wrong. Please try again." }); }
    setLoading(false);
  };

  // success screens
  if (done) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.successWrap}>
            <div className={styles.successIcon}><CheckIcon /></div>
            <h1 className={styles.title}>{done === "email" ? "Check your inbox" : "Password updated"}</h1>
            <p className={styles.subtitle}>
              {done === "email"
                ? "We've sent you a link to reset your password. It's valid for 10 minutes."
                : "Your password has been changed. You can now log in."}
            </p>
            <a href="/login" className={styles.button} style={{ textDecoration: "none" }}>Go to login</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <form className={styles.card} onSubmit={submit} noValidate>
        <h1 className={styles.title}>Reset password</h1>
        <p className={styles.subtitle}>
          {hasToken ? "Choose a new password for your account." : "Enter your email and we'll send you a reset link."}
        </p>

        {banner && <div className={`${styles.banner} ${banner.type === "error" ? styles.bannerError : styles.bannerOk}`}>{banner.text}</div>}

        {!hasToken ? (
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <div className={`${styles.inputWrap} ${err.email ? styles.err : ""}`}>
              <span className={styles.icon}><MailIcon /></span>
              <input className={styles.input} type="email" placeholder="you@company.com"
                value={email} onChange={(e) => { setEmail(e.target.value); setErr({}); }} />
            </div>
            {err.email && <span className={styles.errorMsg}>{err.email}</span>}
          </div>
        ) : (
          <>
            <div className={styles.field}>
              <label className={styles.label}>New password</label>
              <div className={`${styles.inputWrap} ${err.password ? styles.err : ""}`}>
                <span className={styles.icon}><LockIcon /></span>
                <input className={styles.input} type="password" placeholder="••••••••"
                  value={password} onChange={(e) => { setPassword(e.target.value); setErr({}); }} />
              </div>
              {err.password && <span className={styles.errorMsg}>{err.password}</span>}
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Confirm password</label>
              <div className={`${styles.inputWrap} ${err.password2 ? styles.err : (password2 && password === password2 ? styles.ok : "")}`}>
                <span className={styles.icon}><LockIcon /></span>
                <input className={styles.input} type="password" placeholder="••••••••"
                  value={password2} onChange={(e) => { setPassword2(e.target.value); setErr({}); }} />
              </div>
              {err.password2 && <span className={styles.errorMsg}>{err.password2}</span>}
            </div>
          </>
        )}

        <button type="submit" className={styles.button} disabled={loading}>
          {loading && <span className={styles.spinner} />}
          {loading ? "Please wait…" : (hasToken ? "Update password" : "Send reset link")}
        </button>

        <p className={styles.alt}>
          Remember your password? <a href="/login">Log in</a>
        </p>
      </form>
    </div>
  );
};

export default RestorePasswordCard;
