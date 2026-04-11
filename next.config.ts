import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      new URL("https://s3.nikulshin-dev.ru/**"),
    ],
  },
};
export default nextConfig;
