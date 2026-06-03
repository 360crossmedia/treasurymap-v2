const CLOUDINARY_HOST = "res.cloudinary.com";

export function cld(url, opts = {}) {
  if (!url || typeof url !== "string") return url;
  if (!url.includes(CLOUDINARY_HOST)) return url;
  const marker = "/image/upload/";
  const i = url.indexOf(marker);
  if (i === -1) return url;
  const head = url.slice(0, i + marker.length);
  const tail = url.slice(i + marker.length);
  if (/^[a-z]_[^/]+\//.test(tail)) return url;
  const tx = ["f_auto", "q_auto"];
  if (opts.w || opts.h) {
    tx.push(`c_${opts.c || "limit"}`);
    if (opts.w) tx.push(`w_${opts.w}`);
    if (opts.h) tx.push(`h_${opts.h}`);
  } else if (opts.c) {
    tx.push(`c_${opts.c}`);
  }
  if (opts.dpr !== false) tx.push("dpr_auto");
  return `${head}${tx.join(",")}/${tail}`;
}

// Cover crop that keeps the subject (face) in frame: Cloudinary c_fill + g_auto.
// Produces an image at exactly w×h so no CSS cropping can cut off a head.
export function coverImg(url, w, h) {
  if (!url || typeof url !== "string") return url;
  if (!url.includes(CLOUDINARY_HOST)) return url;
  const marker = "/image/upload/";
  const i = url.indexOf(marker);
  if (i === -1) return url;
  const head = url.slice(0, i + marker.length);
  const tail = url.slice(i + marker.length);
  if (/^[a-z]_[^/]+\//.test(tail)) return url; // already transformed
  const tx = ["c_fill", "g_auto", `w_${w}`, `h_${h}`, "f_auto", "q_auto", "dpr_auto"];
  return `${head}${tx.join(",")}/${tail}`;
}
