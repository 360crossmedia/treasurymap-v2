import axios from "axios";
import { url } from "./url";

// Admin-only: list the owner + extra admins of a company.
// Returns [{ id, email, fullName, role: "owner" | "admin" }] or null on failure.
export const apiListCompanyAdmins = async (companyId) => {
  return axios
    .get(`${url}/api/v1/companies/${companyId}/admins`)
    .then((res) => res.data)
    .catch((error) => {
      console.error("Error:", error);
      return null;
    });
};
