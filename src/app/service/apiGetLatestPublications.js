import axios from "axios";
import { url } from "./url";

export const apiGetLatestPublications = async () => {
  try {
    const response = await axios.get(`${url}/api/v1/publications`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};
