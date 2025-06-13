import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "public",
      filename: "service-worker.js",
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "Influencer Hub",
        short_name: "InfluencerHub",
        description:
          "A platform for managing influencer content and notifications",
        theme_color: "#ffffff",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#ffffff",
        icons: [
          {
            src: "/icons/Square44x44Logo.scale-100.png",
            sizes: "44x44",
            type: "image/png",
          },
          {
            src: "/icons/Square150x150Logo.scale-100.png",
            sizes: "150x150",
            type: "image/png",
          },
          {
            src: "/icons/StoreLogo.scale-400.png",
            sizes: "200x200",
            type: "image/png",
          },
          {
            src: "/icons/LargeTile.scale-400.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        sourcemap: true,
        runtimeCaching: [
          {
            urlPattern:
              /^https:\/\/firebaseinstallations\.googleapis\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "firebase-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24,
              },
            },
          },
          {
            urlPattern: /\.(jpg|jpeg|png|gif|svg)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "image-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
    }),
  ],
});
