import axios from "axios";
import { url } from "./url";

// Fire-and-forget: capture the visitor's email as soon as it is valid, so an
// abandoned Build-my-shortlist questionnaire still leaves a contactable lead.
// Never throws and never blocks the form.
export const apiCaptureLead = async ({ email, companyName, website }) => {
  try {
    await axios.post(`${url}/api/v1/longlist/lead`, { email, companyName, website });
  } catch (_) {
    // ignore: capture is best-effort
  }
};
