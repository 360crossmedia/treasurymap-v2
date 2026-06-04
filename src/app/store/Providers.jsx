"use client";
import { Provider } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import store from "../store/index";
import { url } from "../service/url";
import { setAuthToken, clearAuth } from "../service/authToken";

const Providers = ({ children }) => {
  useEffect(() => {
    // Restore the auth token across reloads so every API call carries it.
    try {
      const token = localStorage.getItem("token");
      if (token) setAuthToken(token);
    } catch (_) {}

    // Global 401 handler: an expired/invalid session on OUR backend forces a
    // clean re-login. Scoped to our API so external 401s (e.g. Cloudinary)
    // never bounce the user.
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      (err) => {
        const reqUrl = err?.config?.url || "";
        const isOurApi = reqUrl.startsWith(url);
        if (err?.response?.status === 401 && isOurApi) {
          clearAuth();
          if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
            window.location.href = "/login";
          }
        }
        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  return <Provider store={store}>{children}</Provider>;
};

export default Providers;
