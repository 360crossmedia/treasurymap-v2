import axios from "axios";
import { url } from "./url";

export const apiGetAllUsers = async () => {
  try {
    const response = await axios.get(`${url}/api/v1/users`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};
