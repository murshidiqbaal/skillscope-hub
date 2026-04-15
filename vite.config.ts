import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "./",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    // Target modern browsers — enables smaller, more optimised output
    target: "es2020",

    // Inline assets smaller than 4 KB directly into JS (saves HTTP requests)
    assetsInlineLimit: 4096,

    // Keep the warning threshold — we aim to beat 500 KB, not hide the warning
    chunkSizeWarningLimit: 500,

    rollupOptions: {
      output: {
        // ── Manual chunk strategy ──────────────────────────────────────────
        // Splits the bundle so that:
        //  • Heavy vendor libs are cached independently by the browser
        //  • Pages (lazy-loaded via React.lazy) each get their own chunk
        //  • First-load only downloads react + react-dom + router
        manualChunks(id) {
          // React core — downloaded once, cached longest
          if (id.includes("node_modules/react/") ||
              id.includes("node_modules/react-dom/") ||
              id.includes("node_modules/react-router-dom/") ||
              id.includes("node_modules/@remix-run/")) {
            return "vendor-react";
          }

          // Charting library — only used on Dashboard, keep separate
          if (id.includes("node_modules/recharts") ||
              id.includes("node_modules/victory-") ||
              id.includes("node_modules/d3-")) {
            return "vendor-charts";
          }

          // Animation library — used across pages but not part of core
          if (id.includes("node_modules/framer-motion")) {
            return "vendor-motion";
          }

          // Supabase client — large SDK, only needed after auth
          if (id.includes("node_modules/@supabase/")) {
            return "vendor-supabase";
          }

          // React Query — data-fetching layer
          if (id.includes("node_modules/@tanstack/")) {
            return "vendor-query";
          }

          // Radix UI primitives — large collection of UI components
          if (id.includes("node_modules/@radix-ui/")) {
            return "vendor-radix";
          }

          // Utility packages — small but commonly re-used
          if (id.includes("node_modules/axios") ||
              id.includes("node_modules/clsx") ||
              id.includes("node_modules/class-variance-authority") ||
              id.includes("node_modules/tailwind-merge") ||
              id.includes("node_modules/date-fns") ||
              id.includes("node_modules/zod") ||
              id.includes("node_modules/zustand")) {
            return "vendor-utils";
          }

          // Lucide icons — large icon set, separate chunk avoids tree-shake misses
          if (id.includes("node_modules/lucide-react")) {
            return "vendor-icons";
          }

          // sonner / vaul / cmdk / embla — smaller UI enhancements
          if (id.includes("node_modules/sonner") ||
              id.includes("node_modules/vaul") ||
              id.includes("node_modules/cmdk") ||
              id.includes("node_modules/embla-carousel")) {
            return "vendor-ui-extras";
          }
        },
      },
    },
  },
}));
