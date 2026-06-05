"use client";
import { useState } from "react";
import styles from "../styles/contactUs.module.css";
import { apiSendEmail } from "../service/apiSendEmail";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Icon = {
  user: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  at: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/></svg>,
  building: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/></svg>,
  check: <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>,
  map: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  compass: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>,
  arrow: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
};

const ContactUs = () => {
  const [form, setForm]     = useState({ name: "", email: "", company: "", message: "", website: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name = "Please enter your name";
    if (!form.email.trim())   e.email = "Please enter your email";
    else if (!EMAIL_RE.test(form.email)) e.email = "Please enter a valid email";
    if (!form.company.trim()) e.company = "Please enter your company";
    if (!form.message.trim()) e.message = "Please enter a message";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (status === "sending") return;
    if (form.website) { setStatus("sent"); return; } // honeypot → silently drop
    if (!validate()) return;

    setStatus("sending");
    try {
      const result = await apiSendEmail({
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim(),
        message: form.message.trim(),
      });
      if (result?.status === 200) {
        setStatus("sent");
        setForm({ name: "", email: "", company: "", message: "", website: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>

        {/* ── Header ─────────────────────────────────────────────── */}
        <header className={styles.header}>
          <span className={styles.eyebrow}>// Get in touch</span>
          <h1 className={styles.title}>Let's talk treasury technology</h1>
          <p className={styles.lead}>
            TreasuryMap is the independent map of treasury technology, built with the
            profession and neutral by design. Whether you build the tools or buy them,
            here is how to get on board.
          </p>
        </header>

        {/* ── Two audiences ──────────────────────────────────────── */}
        <div className={styles.audience}>
          <div className={styles.audCard}>
            <div className={styles.audIcon}>{Icon.map}</div>
            <span className={styles.audTag}>For providers</span>
            <h3 className={styles.audTitle}>Get your solution on the map</h3>
            <p className={styles.audText}>
              Be discovered by corporate treasurers actively selecting their next TMS,
              payment hub or FX tool. Claim your profile, publish in your Media Zone,
              and get featured to a qualified audience.
            </p>
            <div className={styles.audCtas}>
              <a className={styles.btnPrimary} href="/signup">
                Create your profile {Icon.arrow}
              </a>
              <a className={styles.btnGhost} href="mailto:contact@360crossmedia.com">
                Be featured live
              </a>
            </div>
          </div>

          <div className={styles.audCard}>
            <div className={styles.audIcon}>{Icon.compass}</div>
            <span className={styles.audTag}>For treasurers</span>
            <h3 className={styles.audTitle}>Follow TreasuryMap</h3>
            <p className={styles.audText}>
              Explore the interactive map, read independent insights, and build a vendor
              shortlist in minutes. Free, neutral, and no sales pitch.
            </p>
            <div className={styles.audCtas}>
              <a className={styles.btnPrimary} href="/">
                Explore the map {Icon.arrow}
              </a>
              <a className={styles.btnGhost} href="/get-my-list">Build my shortlist</a>
            </div>
          </div>
        </div>

        {/* ── Contact (intro + form) ─────────────────────────────── */}
        <div className={styles.contactRow}>
          <aside className={styles.contactIntro}>
            <h2 className={styles.contactHeading}>Prefer to reach us directly?</h2>
            <p className={styles.contactText}>
              Tell us about your project or your listing and we will get back to you,
              usually within one business day.
            </p>
            <p className={styles.trust}>
              <strong>Who we are.</strong> TreasuryMap is powered by Simply Treasury,
              founded by François Masquelier, Chairman of ATEL and EACT and former Head of
              Treasury at RTL Group.
            </p>
          </aside>

          <div className={styles.card}>
            {status === "sent" ? (
              <div className={styles.successBox}>
                <div className={styles.successIcon}>{Icon.check}</div>
                <h2 className={styles.successTitle}>Message sent</h2>
                <p className={styles.successText}>
                  Thanks for reaching out. We'll get back to you shortly.
                </p>
                <button className={styles.linkBtn} onClick={() => setStatus("idle")}>
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <h2 className={styles.cardTitle}>Contact us</h2>

                <Field icon={Icon.user} placeholder="Name" value={form.name}
                       onChange={set("name")} error={errors.name} />
                <Field icon={Icon.at} placeholder="Email address" type="email" value={form.email}
                       onChange={set("email")} error={errors.email} />
                <Field icon={Icon.building} placeholder="Company name" value={form.company}
                       onChange={set("company")} error={errors.company} />

                <div className={styles.field}>
                  <textarea
                    className={`${styles.input} ${styles.textarea} ${errors.message ? styles.inputError : ""}`}
                    placeholder="Your message"
                    rows={5}
                    value={form.message}
                    onChange={set("message")}
                  />
                  {errors.message && <span className={styles.errorMsg}>{errors.message}</span>}
                </div>

                {/* Honeypot */}
                <input type="text" tabIndex={-1} autoComplete="off" value={form.website}
                       onChange={set("website")} className={styles.honeypot} aria-hidden="true" />

                {status === "error" && (
                  <div className={styles.errorBox}>
                    Something went wrong sending your message. Please try again or email us
                    directly at <a href="mailto:contact@360crossmedia.com">contact@360crossmedia.com</a>.
                  </div>
                )}

                <button type="submit" className={styles.button} disabled={status === "sending"}>
                  {status === "sending" && <span className={styles.spinner} />}
                  {status === "sending" ? "Sending…" : "Send message"}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

function Field({ icon, error, ...props }) {
  return (
    <div className={styles.field}>
      <div className={`${styles.inputWrap} ${error ? styles.inputError : ""}`}>
        <span className={styles.inputIcon}>{icon}</span>
        <input className={styles.input} {...props} />
      </div>
      {error && <span className={styles.errorMsg}>{error}</span>}
    </div>
  );
}

export default ContactUs;
