import type { NextConfig } from "next";

// Add startup logging for Next.js configuration
console.log(`[${new Date().toISOString()}] 🔧 Next.js config loading`);
console.log(`[${new Date().toISOString()}] 📍 Config CWD: ${process.cwd()}`);
console.log(
  `[${new Date().toISOString()}] 🌍 Environment: ${process.env.NODE_ENV}`
);
console.log(
  `[${new Date().toISOString()}] 🚀 Next.js version: ${
    require("next/package.json").version
  }`
);

const nextConfig: NextConfig = {
  // Enable detailed error messages in production for debugging
  productionBrowserSourceMaps: true,

  // Add custom headers for debugging
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Debug-Timestamp",
            value: new Date().toISOString(),
          },
          {
            key: "X-Debug-Node-Version",
            value: process.version,
          },
        ],
      },
    ];
  },

  // Enable experimental features that might help with Azure
  experimental: {
    // Add any valid experimental features here
  },

  // Output configuration for deployment
  output: process.env.NODE_ENV === "production" ? "standalone" : undefined,

  // Add webpack configuration for additional logging
  webpack: (config, { isServer, dev }) => {
    console.log(
      `[${new Date().toISOString()}] 📦 Webpack ${
        isServer ? "server" : "client"
      } build ${dev ? "dev" : "production"}`
    );

    if (!dev) {
      console.log(
        `[${new Date().toISOString()}] 🔨 Production webpack build for ${
          isServer ? "server" : "client"
        }`
      );
    }

    return config;
  },
};

console.log(
  `[${new Date().toISOString()}] ✅ Next.js config loaded successfully`
);

export default nextConfig;
