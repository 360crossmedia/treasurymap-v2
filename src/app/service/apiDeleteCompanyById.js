import axios from "axios";
import { url } from "./url";

export const apiDeleteCompanyById = async (id) => {
  const headers = {
    "Content-Type": "application/json",
  };

  return axios
    .delete(`${url}/api/v1/companies/${id}`, { headers })
    .then((res) => res)
    .catch((error) => console.log(error));
};
