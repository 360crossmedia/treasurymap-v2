import axios from "axios";
import { url } from "./url";

export const apiGetMultiplayerMapData = async () => {
  try {
    const response = await axios.get(`${url}/api/v1/mapdata/multiplayerMap`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};
