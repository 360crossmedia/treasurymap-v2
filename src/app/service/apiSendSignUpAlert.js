import axios from "axios";
import { url } from "./url";

export const apiSendSignUpAlert = async (data) => {
  return axios
    .post(`${url}/api/v1/email/signupAlert`, data)
    .then((res) => res)
    .catch((error) => console.error("Error:", error));
};
