/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  env: {
    TELEGRAM_BOT_TOKEN: "",
    TELEGRAM_CHAT_ID: "",
    LINE_NOTIFY_TOKEN: "",
  },
};
export default nextConfig;
