import axios from "axios";
import { url } from "./url";

export const apiUpdateUser = async (userId, data) => {
  return axios
    .put(`${url}/api/v1/users/${userId}`, data)
    .then((res) => res)
    .catch((error) => console.error("Error:", error));
};
