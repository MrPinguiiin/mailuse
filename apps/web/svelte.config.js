import nodeAdapter from "@sveltejs/adapter-node";
import staticAdapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const adapter = process.env.VERCEL
  ? staticAdapter({ pages: "public", assets: "public", fallback: "200.html" })
  : nodeAdapter();

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter,
    prerender: {
      entries: ["*"],
    },
  },
};

export default config;
