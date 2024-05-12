import axios from "axios";
import { url } from "./url";

export const apiGetMainPublication = async () => {
  try {
    const response = await axios.get(`${url}/api/v1/mainPublication`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};
