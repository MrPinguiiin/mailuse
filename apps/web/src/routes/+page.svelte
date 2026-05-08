<script lang="ts">
  import { goto } from "$app/navigation";
  import { api } from "$lib/api";
  import { Mail, Clock, Zap, Shield } from "@lucide/svelte";

  let localPart = $state("");
  let ttlMinutes = $state(60);
  let loading = $state(false);
  let error = $state("");

  async function createInbox() {
    loading = true;
    error = "";

    try {
      const inbox = await api.createInbox({
        localPart: localPart || undefined,
        ttlMinutes,
      });
      goto(`/inbox/${inbox.address}`);
    } catch (e: any) {
      error = e.message || "Failed to create inbox";
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>mailuse - Disposable Email</title>
</svelte:head>

<div class="container mx-auto max-w-3xl px-4 py-12">
  <!-- Hero -->
  <div class="text-center mb-12">
    <h1 class="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
      Disposable Email Inbox
    </h1>
    <p class="text-lg text-zinc-600 dark:text-zinc-400">
      Generate a temporary email address instantly. No signup required.
    </p>
  </div>

  <!-- Generator Form -->
  <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 mb-8 shadow-sm">
    <form onsubmit={(e) => { e.preventDefault(); createInbox(); }} class="space-y-4">
      <div>
        <label for="localPart" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          Custom address (optional)
        </label>
        <div class="flex items-center gap-2">
          <input
            id="localPart"
            type="text"
            bind:value={localPart}
            placeholder="random"
            class="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />
          <span class="text-sm text-zinc-500">@{'{domain}'}</span>
        </div>
      </div>

      <div>
        <label for="ttl" class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          Expires in
        </label>
        <select
          id="ttl"
          bind:value={ttlMinutes}
          class="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
        >
          <option value={15}>15 minutes</option>
          <option value={30}>30 minutes</option>
          <option value={60}>1 hour</option>
          <option value={180}>3 hours</option>
          <option value={720}>12 hours</option>
          <option value={1440}>24 hours</option>
          <option value={10080}>7 days</option>
        </select>
      </div>

      {#if error}
        <p class="text-sm text-red-600 dark:text-red-400">{error}</p>
      {/if}

      <button
        type="submit"
        disabled={loading}
        class="w-full rounded-lg bg-zinc-900 dark:bg-zinc-100 px-4 py-2.5 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 transition-colors"
      >
        {loading ? "Creating..." : "Generate Inbox"}
      </button>
    </form>
  </div>

  <!-- Features -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <div class="flex items-start gap-3 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
      <Zap class="h-5 w-5 text-zinc-500 mt-0.5 shrink-0" />
      <div>
        <h3 class="text-sm font-medium text-zinc-900 dark:text-zinc-100">Instant</h3>
        <p class="text-xs text-zinc-500">No signup, no verification</p>
      </div>
    </div>
    <div class="flex items-start gap-3 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
      <Clock class="h-5 w-5 text-zinc-500 mt-0.5 shrink-0" />
      <div>
        <h3 class="text-sm font-medium text-zinc-900 dark:text-zinc-100">Auto-expire</h3>
        <p class="text-xs text-zinc-500">Inbox self-destructs on schedule</p>
      </div>
    </div>
    <div class="flex items-start gap-3 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
      <Shield class="h-5 w-5 text-zinc-500 mt-0.5 shrink-0" />
      <div>
        <h3 class="text-sm font-medium text-zinc-900 dark:text-zinc-100">Private</h3>
        <p class="text-xs text-zinc-500">No tracking, no data selling</p>
      </div>
    </div>
  </div>
</div>
