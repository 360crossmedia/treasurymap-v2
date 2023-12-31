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

  return axios
    .post(`${url}/api/v1/auth/login`, userJson, { headers })
    .then((res) => res)
    .catch((error) => console.log(error));
};
