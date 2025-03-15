// next.config.mjs

import { withFaust, getWpHostname } from "@faustwp/core";
import { createSecureHeaders } from "next-secure-headers";
// import path from "path";

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: ["node_modules", "src", "src/styles"],
  },
  images: {
    domains: [getWpHostname()],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: createSecureHeaders({
          xssProtection: false,
        }),
      },
    ];
  },
};

export default withFaust(config);
