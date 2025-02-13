import axios from "axios";
import { url } from "./url";

export const apiUploadSubOptions = async (companyId, subOptions) => {
  return axios
    .post(`${url}/api/v1/subOptions/${companyId}`, {
      selectedSubOptions: subOptions,
    })
    .then((response) => response)
    .catch((error) => console.error("Error:", error));
};
