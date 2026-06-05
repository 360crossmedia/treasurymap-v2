import axios from "axios";
import { url } from "./url";

// Forgot-password: send the reset token + new password to the backend, which
// verifies the token server-side. No secret/verification lives in the client.
export const apiResetPassword = async (token, password) => {
  return axios
    .post(`${url}/api/v1/auth/reset-password`, { token, password })
    .then((res) => res)
    .catch((error) => error?.response || console.error("Error:", error));
};
