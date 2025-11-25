import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  root: path.resolve(__dirname, "."),
  server: {
    host: "::",
    port: 8080,
  },
  publicDir: path.resolve(__dirname, "public"),
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
