import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        "^/api": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          // withCredentials: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  });
};
