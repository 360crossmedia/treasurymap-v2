import axios from "axios";
import { url } from "./url";

export const apiSubscribeNewsletter = async ({ email, name }) => {
  return axios
    .post(`${url}/api/v1/newsletter/subscribe`, { email, name })
    .then((res) => res)
    .catch((error) => error?.response || { status: 502, data: { ok: false } });
};
