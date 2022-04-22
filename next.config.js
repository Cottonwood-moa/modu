/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "imagedelivery.net",
      "lh3.googleusercontent.com",
      "avatars.githubusercontent.com",
    ],
  },
};

module.exports = nextConfig;
