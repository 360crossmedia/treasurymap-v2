import axios from "axios";
import { url } from "./url";

export const apiUpdatePassword = async (userId, password) => {
  return axios
    .put(`${url}/api/v1/auth/updatePassword/${userId}`, { password })
    .then((res) => res)
    .catch((error) => console.error("Error:", error));
};
