import axios from "axios";
import { url } from "./url";

export const apiSendEmail = async (data) => {
  return axios
    .post(`${url}/api/v1/email`, data)
    .then((res) => res)
    .catch((error) => console.error("Error:", error));
};
