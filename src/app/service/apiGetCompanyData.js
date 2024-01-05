import axios from "axios";
import { url } from "./url";

export const apiGetCompanyData = async (id) => {
  return axios
    .get(`${url}/api/v1/companies/${id}`)
    .then((res) => res.data)
    .catch((error) => console.error("Error:", error));
};
