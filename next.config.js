/** @type {import('next').NextConfig} */
const intercept = require("intercept-stdout");

// safely ignore recoil stdout warning messages
function interceptStdout(text) {
  if (text.includes("Duplicate atom key")) {
    return "";
  }
  return text;
}

// Intercept in dev and prod
intercept(interceptStdout);
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "imagedelivery.net",
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
    ],
  },
  experimental: {
    scrollRestoration: true,
  },
};

module.exports = nextConfig;
