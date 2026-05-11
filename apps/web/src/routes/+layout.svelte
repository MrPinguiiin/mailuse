<script lang="ts">
  import "../app.css";
  import { page } from "$app/state";
  import Header from "../components/Header.svelte";

  const { children } = $props();
  const showHeader = $derived(!page.url.pathname.startsWith("/dashboard"));
</script>

<div class="grid h-svh {showHeader ? 'grid-rows-[auto_1fr]' : 'grid-rows-[1fr]'}">
  {#if showHeader}
    <Header />
  {/if}
  <main class="overflow-y-auto">
    {@render children()}
  </main>
</div>
