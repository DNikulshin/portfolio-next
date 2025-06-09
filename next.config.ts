import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://sqknuzynvougbvrw.public.blob.vercel-storage.com/**"),
    ],
  },
};

export default nextConfig;
