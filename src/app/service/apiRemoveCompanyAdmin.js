import axios from "axios";
import { url } from "./url";

// Admin-only: remove an extra admin link from a company (never the owner).
// Returns { ok, data } on success or { ok:false, message } on failure.
export const apiRemoveCompanyAdmin = async (companyId, userId) => {
  return axios
    .delete(`${url}/api/v1/companies/${companyId}/admins/${userId}`)
    .then((res) => ({ ok: true, data: res.data }))
    .catch((error) => ({
      ok: false,
      message: error?.response?.data?.message || "Could not remove this admin.",
    }));
};
