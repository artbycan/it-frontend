import type { NextConfig } from "next";
//import {API_BASE_URL} from "@/app/config/api";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8087',
        pathname: '/**'
      }
    ]
  }

};

export default nextConfig;
