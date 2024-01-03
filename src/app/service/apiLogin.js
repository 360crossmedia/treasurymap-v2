import axios from "axios";
import { url } from "./url";

export const apiLogin = async (datos) => {
  let user = {
    email: datos.email,
    password: datos.password,
  };

  return axios
    .post(`${url}/api/v1/auth/login`, user)
    .then((response) => response)
    .catch((error) => console.error("Error:", error));
};
