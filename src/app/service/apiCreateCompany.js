import axios from "axios";
import { url } from "./url";

export const apiCreateCompany = async (company) => {
  const headers = {
    "Content-Type": "application/json",
  };

  return axios
    .post(`${url}/api/v1/companies/create`, company, { headers })
    .then((res) => res)
    .catch((error) => console.log(error));
};
