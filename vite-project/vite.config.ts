import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import commonjs from "vite-plugin-commonjs";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), commonjs()],
  resolve: {
    alias: {
      fs: "empty", // Игнорировать модуль fs
    },
  },
  optimizeDeps: {
    exclude: ["pdf-parse"], // Исключить pdf-parse из предварительной сборки
  },
});
