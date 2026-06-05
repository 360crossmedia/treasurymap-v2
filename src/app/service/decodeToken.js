// Decode the payload of a JWT on the client (NO signature verification, that is
// the server's job). We only use it to read the current session's user id so the
// UI state matches the token actually sent to the API. This prevents the class
// of bug where localStorage.userId says "admin" but the effective token is for a
// different (or expired) user, which made the dashboard silently show a broken
// admin view with no owner emails.
export function decodeToken(token) {
  try {
    if (!token || typeof token !== "string") return null;
    const part = token.split(".")[1];
    if (!part) return null;
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const json = decodeURIComponent(
      atob(padded)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}
