import axios from "axios";
import { url } from "./url";

// Exchange a magic edit-link token for a normal session (same shape as login).
// The token is verified server-side; nothing sensitive lives in the client.
export const apiMagicLogin = async (token) => {
  return axios
    .post(`${url}/api/v1/auth/magic-login`, { token })
    .then((res) => res)
    .catch((error) => error?.response || console.error("Error:", error));
};
