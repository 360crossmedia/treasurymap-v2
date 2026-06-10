import axios from "axios";
import { url } from "./url";

// Admin only: list every Build-my-shortlist / comparison request (the leads).
// Uses the global axios auth header (admin must be logged in). Returns an array
// of { id, email, companyName, categoryIds, reportType, status, createdAt,
// emailedAt, accessToken } or [] on failure.
export const apiGetLonglistReports = async () => {
  return axios
    .get(`${url}/api/v1/longlist/reports`)
    .then((res) => res.data)
    .catch((error) => {
      console.error("Failed to load shortlist leads:", error?.response?.status || error?.message);
      return [];
    });
};
