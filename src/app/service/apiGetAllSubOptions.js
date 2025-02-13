import axios from "axios";
import { url } from "./url";

export const apiGetAllSubOptions = async () => {
  return axios
    .get(`${url}/api/v1/subOptions`)
    .then((res) => res.data)
    .catch((error) => console.error("Error:", error));
};
