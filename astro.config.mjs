// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  output: "static",
  site: "https://www.orcosteopathy.com",

  integrations: [
    sitemap({
      // Keep the admin app and login out of search engines' sitemap
      filter: (page) => !page.includes("/admin"),
      i18n: {
        defaultLocale: "el",
        locales: { el: "el", en: "en" },
      },
    }),
  ],

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
