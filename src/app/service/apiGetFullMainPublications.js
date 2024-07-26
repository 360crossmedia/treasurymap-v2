import axios from "axios";
import { url } from "./url";

export const apiGetFullMainPublications = async () => {
  try {
    const response = await axios.get(`${url}/api/v1/mainPublications/full`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};
