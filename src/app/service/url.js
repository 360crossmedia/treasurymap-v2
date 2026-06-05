// API base URL · driven by NEXT_PUBLIC_API_URL env var (set in Railway).
// Falls back to localhost:8000 for local dev when the var is unset.
export const url =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
