import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const srcDir = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": srcDir,
    },
  },

  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },

  build: {
    // Warn when chunks exceed 400kb
    chunkSizeWarningLimit: 400,

    rollupOptions: {
      output: {
        // Split vendor libs into separate cached chunks
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router"],
          "vendor-motion": ["framer-motion"],
          "vendor-forms": ["react-hook-form", "@hookform/resolvers", "zod"],
          "vendor-icons": ["lucide-react"],
          "vendor-axios": ["axios"],
        },
      },
    },

    sourcemap: false,
    minify: "esbuild",
    target: "es2020",
  },
});
