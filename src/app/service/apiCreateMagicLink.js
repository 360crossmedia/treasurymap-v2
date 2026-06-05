import axios from "axios";
import { url } from "./url";

// Admin-only: ask the backend to mint a magic edit-link token for a vendor.
// Uses the global axios auth header (admin must be logged in). Returns
// { token, userId, email } or null on failure.
export const apiCreateMagicLink = async (userId) => {
  return axios
    .post(`${url}/api/v1/auth/magic-link`, { userId })
    .then((res) => res.data)
    .catch((error) => {
      console.error("Error:", error);
      return null;
    });
};
