import axios from "axios";
import { url } from "./url";

export const apiUpdateMainPublication = async (publicationData) => {
  return axios
    .put(`${url}/api/v1/mainPublication/1`, publicationData)
    .then((res) => res)
    .catch((error) => console.error("Error:", error));
};
