import axios from "axios";
import { url } from "./url";

export const apiGetUserById = async (id) => {
  return axios
    .get(`${url}/api/v1/users/${id}`)
    .then((res) => res.data)
    .catch((error) => console.error("Error:", error));
};
