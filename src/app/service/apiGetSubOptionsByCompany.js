import axios from "axios";
import { url } from "./url";

export const apiGetSubOptionsByCompany = async (companyId) => {
  return axios
    .get(`${url}/api/v1/subOptions/${companyId}`)
    .then((res) => res.data)
    .catch((error) => console.error("Error:", error));
};
