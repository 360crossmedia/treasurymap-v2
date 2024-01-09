import axios from "axios";
import { url } from "./url";

export const apiGetAllCompanies = async () => {
  return axios
    .get(`${url}/api/v1/companies/`)
    .then((res) => res.data)
    .catch((error) => console.log(error));
};
