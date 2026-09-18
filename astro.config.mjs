import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  // Required: sitemap and RSS build absolute URLs from this.
  site: "https://techytimms.com",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [mdx(), sitemap(), react()],
});