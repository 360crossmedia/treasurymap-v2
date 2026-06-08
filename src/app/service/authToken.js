import axios from "axios";
import { url } from "./url";

// Attach the bearer token from localStorage to EVERY request to our own API,
// read fresh at request time. This removes a race condition: the boot effect
// that sets axios.defaults (Providers) runs AFTER child component effects in
// React, so a page loaded directly on /dashboard could fire its fetch before
// the default header was set, hitting the API anonymously (the admin dashboard
// then lost owner emails and showed #id on every hard refresh). The guard on
// `url` ensures we never leak the token to third parties (Cloudinary, fonts).
if (typeof window !== "undefined" && !axios.__tmAuthInterceptor) {
  axios.__tmAuthInterceptor = true;
  axios.interceptors.request.use((config) => {
    try {
      const reqUrl = config.url || "";
      if (reqUrl.startsWith(url)) {
        const t = localStorage.getItem("token");
        if (t) {
          config.headers = config.headers || {};
          if (!config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${t}`;
          }
        }
      }
    } catch (_) {}
    return config;
  });
}

// Single source of truth for the Authorization header used on every API call.
// Set after login (and on app boot from localStorage); cleared on logout/401.
export function setAuthToken(token) {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try { localStorage.setItem("token", token); } catch (_) {}
  } else {
    delete axios.defaults.headers.common["Authorization"];
    try { localStorage.removeItem("token"); } catch (_) {}
  }
}

export function clearAuth() {
  setAuthToken(null);
  try {
    localStorage.removeItem("userId");
    localStorage.removeItem("companyId");
  } catch (_) {}
}
