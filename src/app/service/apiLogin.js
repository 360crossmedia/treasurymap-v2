import axios from "axios";
import { url } from "./url";

export const apiLogin = async (datos) => {
  const headers = {
    "Content-Type": "application/json",
  };

  let user = {
    email: datos.email,
    password: datos.password,
  };
  let userJson = JSON.stringify(user);

  const config = {
    crossDomain: true,
    withCredentials: true,
    // Otras configuraciones...
  };

  return axios
    .post(`${url}/api/v1/auth/login`, user, config)
    .then((response) => response)
    .catch((error) => console.error("Error:", error));
};
