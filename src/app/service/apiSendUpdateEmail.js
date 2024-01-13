import axios from "axios";
import { url } from "./url";

export const apiSendUpdateEmail = async (data) => {
  return axios
    .post(`${url}/api/v1/email/updateMessage`, data)
    .then((res) => res)
    .catch((error) => console.error("Error:", error));
};
