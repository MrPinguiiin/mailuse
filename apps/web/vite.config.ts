import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  optimizeDeps: {
    exclude: ["@lucide/svelte", "lucide-svelte", "bits-ui"],
  },
  resolve: {
    conditions: ["svelte", "browser", "import", "default"],
  },
});
