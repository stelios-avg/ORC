// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  output: "static",

  i18n: {
    defaultLocale: "el",
    locales: ["el", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  vite: {
    plugins: [tailwindcss()],
  },
});
