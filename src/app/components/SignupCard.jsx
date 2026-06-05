"use client";
import { useState } from "react";
import styles from "../styles/auth.module.css";
import { apiCreateUser } from "../service/apiCreateUser";
import { apiSendSignUpAlert } from "../service/apiSendSignUpAlert";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const I = {
  building: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/></svg>,
  user: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  mail: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>,
  lock: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  check: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>,
};

function Field({ label, icon, type = "text", placeholder, value, onChange, error }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <div className={`${styles.inputWrap} ${error ? styles.err : ""}`}>
        <span className={styles.icon}>{icon}</span>
        <input className={styles.input} type={type} placeholder={placeholder} value={value} onChange={onChange} />
      </div>
      {error && <span className={styles.errorMsg}>{error}</span>}
    </div>
  );
}

const SignupCard = () => {
  const [f, setF] = useState({ companyName: "", fullName: "", email: "", password: "", confPassword: "" });
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k) => (e) => { setF((x) => ({ ...x, [k]: e.target.value })); setErrors((x) => ({ ...x, [k]: undefined })); };

  const validate = () => {
    const e = {};
    if (!f.companyName.trim()) e.companyName = "Required";
    if (!f.fullName.trim()) e.fullName = "Required";
    if (!f.email.trim()) e.email = "Required";
    else if (!EMAIL_RE.test(f.email)) e.email = "Enter a valid email";
    if (f.password.length < 6) e.password = "Use at least 6 characters";
    if (f.confPassword !== f.password) e.confPassword = "Passwords don't match";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setBanner("");
    if (loading || !validate()) return;
    setLoading(true);
    try {
      const payload = {
        companyName: f.companyName.trim(),
        fullName: f.fullName.trim(),
        email: f.email.toLowerCase().trim(),
        password: f.password,
      };
      const data = await apiCreateUser(payload);
      const alertData = { email: payload.email, fullName: payload.fullName, companyName: payload.companyName };
      if (data === 201) {
        try { await apiSendSignUpAlert({ ...alertData, status: "New sign-up ✅" }); } catch (_) {}
        setDone(true);
      } else {
        try {
          await apiSendSignUpAlert({
            ...alertData,
            status: data === 400 ? "Sign-up attempt ⚠️ (email may already exist)" : "Sign-up attempt ⚠️ (failed)",
          });
        } catch (_) {}
        setBanner(
          data === 400
            ? "This email may already have an account. Try logging in, or use a different email."
            : "We couldn't create your account. Please try again."
        );
        setLoading(false);
      }
    } catch {
      setBanner("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.successWrap}>
            <div className={styles.successIcon}>{I.check}</div>
            <h1 className={styles.title}>Account created</h1>
            <p className={styles.subtitle}>Your account is ready. You can now log in to manage your listing.</p>
            <a href="/login" className={styles.button} style={{ textDecoration: "none" }}>Go to login</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <form className={styles.card} style={{ maxWidth: 460 }} onSubmit={submit} noValidate>
        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.subtitle}>
          Once we've validated your company's presence on the map by email, set up your account here.
        </p>

        {banner && <div className={`${styles.banner} ${styles.bannerError}`}>{banner}</div>}

        <Field label="Company name" icon={I.building} placeholder="Acme Corp" value={f.companyName} onChange={set("companyName")} error={errors.companyName} />
        <Field label="Full name" icon={I.user} placeholder="Jane Doe" value={f.fullName} onChange={set("fullName")} error={errors.fullName} />
        <Field label="Email" icon={I.mail} type="email" placeholder="you@company.com" value={f.email} onChange={set("email")} error={errors.email} />
        <Field label="Password" icon={I.lock} type="password" placeholder="••••••••" value={f.password} onChange={set("password")} error={errors.password} />
        <Field label="Confirm password" icon={I.lock} type="password" placeholder="••••••••" value={f.confPassword} onChange={set("confPassword")} error={errors.confPassword} />

        <button type="submit" className={styles.button} disabled={loading}>
          {loading && <span className={styles.spinner} />}
          {loading ? "Creating…" : "Sign up"}
        </button>

        <p className={styles.alt}>
          Already have an account? <a href="/login">Log in</a>
        </p>
        <p className={styles.subtitle} style={{ fontSize: "0.82rem", marginTop: 14, marginBottom: 0 }}>
          Think your company should be on the map?{" "}
          <a className={styles.link} href="mailto:contact@360Crossmedia.com">contact@360Crossmedia.com</a>
        </p>
      </form>
    </div>
  );
};

export default SignupCard;
