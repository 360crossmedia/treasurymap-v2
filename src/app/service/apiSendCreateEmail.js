import axios from "axios";
import { url } from "./url";

export const apiSendCreateEmail = async (data) => {
  return axios
    .post(`${url}/api/v1/email/createMessage`, data)
    .then((res) => res)
    .catch((error) => console.error("Error:", error));
};
