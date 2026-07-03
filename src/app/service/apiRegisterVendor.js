import axios from "axios";
import { url } from "./url";

// Admin: create a vendor user account and return the full result (including the
// new user id) so the caller can transfer a listing to it. The public /register
// endpoint whitelists { fullName, email, password } server-side.
export const apiRegisterVendor = async ({ fullName, email, password }) => {
  try {
    const res = await axios.post(
      `${url}/api/v1/auth/register`,
      { fullName, email, password },
      { headers: { "Content-Type": "application/json" } }
    );
    return { ok: res.status === 201, status: res.status, user: res.data };
  } catch (error) {
    return {
      ok: false,
      status: error?.response?.status || 0,
      message: error?.response?.data?.message || "",
    };
  }
};
