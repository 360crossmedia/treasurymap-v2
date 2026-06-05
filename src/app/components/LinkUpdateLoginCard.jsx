"use client";
import styles from "../styles/loginCard.module.css";
import { useEffect, useState } from "react";
import { apiMagicLogin } from "../service/apiMagicLogin";
import { setAuthToken } from "../service/authToken";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "../store/slices/user.slice";
import { setIsLoading } from "../store/slices/isLoading.slice";

// Magic edit-link landing: the URL token IS the credential. We exchange it
// server-side for a session (no shared password, nothing to guess). On success
// we set the session and redirect to the dashboard; on failure we explain.
const LinkUpdateLoginCard = ({ token }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [status, setStatus] = useState("loading"); // "loading" | "error"

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!token) {
        setStatus("error");
        return;
      }
      dispatch(setIsLoading(true));
      const res = await apiMagicLogin(token);
      if (cancelled) return;
      dispatch(setIsLoading(false));
      if (res && res.status === 200 && res.data?.token) {
        const data = res.data;
        dispatch(setUser(data.id));
        try {
          localStorage.clear();
          localStorage.setItem("userId", data.id);
        } catch (_) {}
        setAuthToken(data.token);
        router.push("/dashboard");
      } else {
        setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className={styles.cardContainer}>
      <div className={styles.card}>
        {status === "loading" ? (
          <div>
            <p className={styles.cardTitle}>Signing you in…</p>
            <p className={styles.cardDescription}>
              Verifying your secure edit link.
            </p>
          </div>
        ) : (
          <div>
            <p className={styles.cardTitle}>Link expired or invalid</p>
            <p className={styles.cardDescription}>
              This edit link is no longer valid. Please contact the administrator
              to receive a new one.
            </p>
            <a
              href="/login"
              className={styles.button}
              style={{ textDecoration: "none", display: "inline-block", textAlign: "center" }}
            >
              Go to login
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkUpdateLoginCard;
