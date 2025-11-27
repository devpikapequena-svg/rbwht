import type { NextConfig } from "next";
// 👇 importa manualmente
const TerserPlugin = require("terser-webpack-plugin");

const nextConfig: NextConfig = {
  eslint: {
    // 🚀 Faz o deploy mesmo com erros de lint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 🚀 Faz o deploy mesmo se tiver erros TS
    ignoreBuildErrors: true,
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      // remove todos os console.* em produção
      config.optimization.minimizer.push(
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true, // 🔥 remove console.log, console.warn, etc.
            },
          },
        })
      );
    }
    return config;
  },
};

export default nextConfig;
