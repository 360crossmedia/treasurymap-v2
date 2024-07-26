import axios from "axios";
import { url } from "./url";

export const apiNewPublicationAlert = async (data) => {
  return axios
    .post(`${url}/api/v1/email/newPublicationAlert`, data)
    .then((res) => res)
    .catch((error) => console.error("Error:", error));
};
