import axios from "axios";
import { url } from "./url";

export const apiUpdateCompany = async (companyId, company) => {
  return axios
    .put(`${url}/api/v1/companies/${companyId}`, company)
    .then((response) => response)
    .catch((error) => console.error("Error:", error));
};
