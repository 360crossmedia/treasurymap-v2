import axios from "axios";

// Ask the Next server to flush the cached Insights page right after an admin
// changes the featured publications, so the new order shows immediately instead
// of after the 5-minute ISR window. Same-origin call; the global Authorization
// header (admin token) is attached automatically. Best-effort, never throws.
export const apiRevalidatePublications = async () => {
  try {
    await axios.post("/api/revalidate");
  } catch (_) {
    // ignore: revalidation is best-effort, the 5-min ISR is the fallback
  }
};
