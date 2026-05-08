<script lang="ts">
  import { page } from "$app/state";
  import { api } from "$lib/api";
  import { timeAgo, formatBytes, timeRemaining } from "$lib/utils";
  import { Mail, Trash2, RefreshCw, Clock, Copy, Check } from "@lucide/svelte";
  import { POLLING_INTERVAL_MS } from "@mailuse/shared/constants";
  import type { Inbox, EmailSummary } from "@mailuse/shared/types";

  const address = $derived(decodeURIComponent(page.params.address));

  let inbox = $state<Inbox | null>(null);
  let emails = $state<EmailSummary[]>([]);
  let loading = $state(true);
  let error = $state("");
  let copied = $state(false);
  let polling = $state(true);
  let pollTimer: ReturnType<typeof setInterval> | null = null;

  async function loadInbox() {
    try {
      inbox = await api.getInbox(address);
    } catch (e: any) {
      error = e.message;
    }
  }

  async function loadEmails() {
    try {
      const result = await api.listEmails(address);
      emails = result.emails;
    } catch (e: any) {
      // Inbox might not exist yet
    } finally {
      loading = false;
    }
  }

  async function refresh() {
    loading = true;
    await Promise.all([loadInbox(), loadEmails()]);
    loading = false;
  }

  async function deleteInbox() {
    if (!confirm("Delete this inbox and all emails?")) return;
    try {
      await api.deleteInbox(address);
      window.location.href = "/";
    } catch (e: any) {
      error = e.message;
    }
  }

  function copyAddress() {
    navigator.clipboard.writeText(address);
    copied = true;
    setTimeout(() => (copied = false), 2000);
  }

  function startPolling() {
    pollTimer = setInterval(loadEmails, POLLING_INTERVAL_MS);
  }

  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  }

  $effect(() => {
    refresh();
    startPolling();
    return () => stopPolling();
  });
</script>

<svelte:head>
  <title>{address} - mailuse</title>
</svelte:head>

<div class="container mx-auto max-w-3xl px-4 py-6">
  <!-- Inbox Header -->
  <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 mb-4">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <Mail class="h-5 w-5 text-zinc-500" />
        <h1 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100 break-all">
          {address}
        </h1>
      </div>
      <div class="flex items-center gap-2">
        <button
          onclick={copyAddress}
          class="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          title="Copy address"
        >
          {#if copied}
            <Check class="h-4 w-4 text-green-500" />
          {:else}
            <Copy class="h-4 w-4 text-zinc-500" />
          {/if}
        </button>
        <button
          onclick={refresh}
          class="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          title="Refresh"
        >
          <RefreshCw class="h-4 w-4 text-zinc-500 {loading ? 'animate-spin' : ''}" />
        </button>
        <button
          onclick={deleteInbox}
          class="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
          title="Delete inbox"
        >
          <Trash2 class="h-4 w-4 text-red-500" />
        </button>
      </div>
    </div>

    {#if inbox?.expiresAt}
      <div class="flex items-center gap-1.5 text-xs text-zinc-500">
        <Clock class="h-3.5 w-3.5" />
        <span>{timeRemaining(inbox.expiresAt)}</span>
      </div>
    {/if}
  </div>

  <!-- Email List -->
  {#if error}
    <div class="text-center py-12">
      <p class="text-red-600 dark:text-red-400">{error}</p>
    </div>
  {:else if loading && emails.length === 0}
    <div class="text-center py-12">
      <RefreshCw class="h-6 w-6 text-zinc-400 animate-spin mx-auto mb-3" />
      <p class="text-sm text-zinc-500">Loading emails...</p>
    </div>
  {:else if emails.length === 0}
    <div class="text-center py-12">
      <Mail class="h-10 w-10 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
      <p class="text-sm text-zinc-500 mb-1">No emails yet</p>
      <p class="text-xs text-zinc-400">
        Send an email to <span class="font-mono">{address}</span> and it will appear here
      </p>
    </div>
  {:else}
    <div class="space-y-2">
      {#each emails as email}
        <a
          href="/inbox/{encodeURIComponent(address)}/{email.id}"
          class="block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                {email.subject || "(no subject)"}
              </p>
              <p class="text-xs text-zinc-500 truncate mt-0.5">
                {email.fromAddress}
              </p>
            </div>
            <div class="text-right shrink-0">
              <p class="text-xs text-zinc-400">{timeAgo(email.receivedAt)}</p>
              <p class="text-xs text-zinc-400 mt-0.5">{formatBytes(email.rawSize)}</p>
            </div>
          </div>
          {#if email.hasAttachments}
            <div class="mt-2">
              <span class="inline-flex items-center text-xs text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                Attachments
              </span>
            </div>
          {/if}
        </a>
      {/each}
    </div>
  {/if}
</div>
