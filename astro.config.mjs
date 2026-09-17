import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  // Required: sitemap and RSS build absolute URLs from this.
  site: "https://techytimms.com",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [mdx(), sitemap()],
});
