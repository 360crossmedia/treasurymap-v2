import axios from "axios";
import { url } from "./url";

export const apiUpdateMainPublication = async (
  mainPublicationId,
  publicationData
) => {
  return axios
    .put(`${url}/api/v1/mainPublications/${mainPublicationId}`, publicationData)
    .then((res) => res)
    .catch((error) => console.error("Error:", error));
};
