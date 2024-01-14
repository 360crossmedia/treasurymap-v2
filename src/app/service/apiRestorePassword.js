import axios from "axios";
import { url } from "./url";

export const apiRestorePassword = async (email) => {
  return axios
    .post(`${url}/api/v1/email/restorePassword`, { email })
    .then((res) => res)
    .catch((error) => console.error("Error:", error));
};
