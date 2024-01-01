import axios from "axios";
import { url } from "./url";

export const apiLogin = async (datos) => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    Accept: "*/*",
    "User-Agent": "PostmanRuntime/7.36.0",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
    "Cache-Control": "no-cache",
    "Accept-Encoding": "gzip, deflate, br",
    Connection: "keep-alive",
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
