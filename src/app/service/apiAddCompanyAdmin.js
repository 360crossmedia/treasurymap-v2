import axios from "axios";
import { url } from "./url";

// Admin-only: add an extra admin to a company by email (creates the account if
// it does not exist). Returns { ok, data:{ user, created, token } } on success,
// or { ok:false, status, message } on failure (e.g. 409 already owner).
export const apiAddCompanyAdmin = async (companyId, { email, fullName } = {}) => {
  return axios
    .post(`${url}/api/v1/companies/${companyId}/admins`, { email, fullName })
    .then((res) => ({ ok: true, data: res.data }))
    .catch((error) => ({
      ok: false,
      status: error?.response?.status || 0,
      message: error?.response?.data?.message || "Could not add this admin.",
    }));
};
