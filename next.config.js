/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  async redirects() {
    return [
      // Compare tool removed (no reliable data source) → funnel to Make my Selection
      { source: "/compare-tools", destination: "/get-my-list", permanent: true },
      { source: "/compare-tools/:path*", destination: "/get-my-list", permanent: true },
    ];
  },
};
