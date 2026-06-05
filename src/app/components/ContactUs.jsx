"use client";
import { useState } from "react";
import styles from "../styles/contactUs.module.css";
import { apiSendEmail } from "../service/apiSendEmail";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Icon = {
  phone: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  mail: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>,
  pin: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  user: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  at: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/></svg>,
  building: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/></svg>,
  check: <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>,
  map: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  compass: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>,
  arrow: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
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

        {/* Left · value proposition for the two audiences */}
        <aside className={styles.left}>
          <span className={styles.eyebrow}>// Get in touch</span>
          <h1 className={styles.title}>Let's talk treasury technology</h1>
          <p className={styles.lead}>
            TreasuryMap is the independent map of treasury technology, built with the
            profession and neutral by design. Here is how to get on board.
          </p>

          <div className={styles.audience}>
            {/* Providers */}
            <div className={styles.audCard}>
              <div className={styles.audIcon}>{Icon.map}</div>
              <div className={styles.audBody}>
                <span className={styles.audTag}>For providers</span>
                <h3 className={styles.audTitle}>Get your solution on the map</h3>
                <p className={styles.audText}>
                  Be discovered by corporate treasurers actively selecting their next TMS,
                  payment hub or FX tool. Claim your profile, publish in your Media Zone,
                  and get featured to a qualified audience.
                </p>
                <div className={styles.audCtas}>
                  <a className={styles.ctaPrimary} href="/signup">
                    Create your profile {Icon.arrow}
                  </a>
                  <a className={styles.ctaGhost} href="mailto:contact@360crossmedia.com">
                    Contact us to be featured
                  </a>
                </div>
              </div>
            </div>

            {/* Treasurers */}
            <div className={styles.audCard}>
              <div className={styles.audIcon}>{Icon.compass}</div>
              <div className={styles.audBody}>
                <span className={styles.audTag}>For treasurers</span>
                <h3 className={styles.audTitle}>Follow TreasuryMap</h3>
                <p className={styles.audText}>
                  Explore the interactive map, read independent insights, and build a vendor
                  shortlist in minutes. Free, neutral, and no sales pitch.
                </p>
                <div className={styles.audCtas}>
                  <a className={styles.ctaPrimary} href="/">
                    Explore the map {Icon.arrow}
                  </a>
                  <a className={styles.ctaGhost} href="/get-my-list">Build my shortlist</a>
                  <a className={styles.ctaGhost} href="/insights">Read insights</a>
                </div>
              </div>
            </div>
          </div>

          <p className={styles.trust}>
            <strong>Who we are.</strong> TreasuryMap is powered by Simply Treasury, founded
            by François Masquelier, Chairman of ATEL and EACT and former Head of Treasury at
            RTL Group.
          </p>
        </aside>

        {/* Right · form */}
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
                  rows={6}
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
