import axios from "axios";

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
