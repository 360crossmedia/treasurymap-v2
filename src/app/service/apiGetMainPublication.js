import axios from "axios";
import { url } from "./url";

export const apiGetMainPublications = async () => {
  try {
    const response = await axios.get(`${url}/api/v1/mainPublications`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};
