import axios from "axios";
import { url } from "./url";

export const apiGetCompaniesByOwner = async (id) => {
  const headers = {
    "Content-Type": "application/json",
  };

  return axios
    .get(`${url}/api/v1/companies/getByOwner/${id}`, { headers })
    .then((res) => res)
    .catch((error) => console.log(error));
};
