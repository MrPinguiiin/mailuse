<script lang="ts">
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { buttonVariants } from "$lib/components/ui/button";
  import { api } from "$lib/api";
  import { cn, timeAgo, formatBytes } from "$lib/utils";
  import { ArrowLeft, Trash2, Paperclip, Download, FileText, Code, List } from "lucide-svelte";
  import type { EmailDetail } from "@mailuse/shared/types";

  const address = $derived(decodeURIComponent(page.params.address));
  const emailId = $derived(page.params.id);

  let email = $state<EmailDetail | null>(null);
  let loading = $state(true);
  let deleting = $state(false);
  let error = $state("");
  let activeTab = $state<"text" | "html" | "headers">("text");

  async function loadEmail() {
    try {
      email = await api.getEmail(address, emailId);
      // Default to html tab if html body exists
      if (email.htmlBody && !email.textBody) {
        activeTab = "html";
      }
    } catch (e: any) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  async function deleteEmail() {
    deleting = true;
    try {
      await api.deleteEmail(address, emailId);
      goto(`/inbox/${encodeURIComponent(address)}`);
    } catch (e: any) {
      error = e.message;
      deleting = false;
    }
  }

  $effect(() => {
    loadEmail();
  });
</script>

<svelte:head>
  <title>{email?.subject || "Email"} - mailuse</title>
</svelte:head>

<div class="container mx-auto max-w-3xl px-4 py-6">
  <!-- Back + Actions -->
  <div class="flex items-center justify-between mb-4">
    <a
      href="/inbox/{encodeURIComponent(address)}"
      class="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
    >
      <ArrowLeft class="h-4 w-4" />
      Back to inbox
    </a>
    <AlertDialog.Root>
      <AlertDialog.Trigger
        class={cn(buttonVariants({ variant: "destructive", size: "sm" }), "gap-1.5")}
      >
        <Trash2 class="h-4 w-4" />
        Delete
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Header>
          <AlertDialog.Title>Delete this email?</AlertDialog.Title>
          <AlertDialog.Description>
            This action cannot be undone. The email{email?.subject ? ` "${email.subject}"` : ""} will be permanently removed from this inbox.
          </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
          <AlertDialog.Cancel disabled={deleting}>Cancel</AlertDialog.Cancel>
          <AlertDialog.Action variant="destructive" onclick={deleteEmail} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete email"}
          </AlertDialog.Action>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog.Root>
  </div>

  {#if loading}
    <div class="text-center py-12">
      <p class="text-sm text-zinc-500">Loading email...</p>
    </div>
  {:else if error}
    <div class="text-center py-12">
      <p class="text-red-600 dark:text-red-400">{error}</p>
    </div>
  {:else if email}
    <!-- Email Header -->
    <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 mb-4">
      <h1 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
        {email.subject || "(no subject)"}
      </h1>
      <div class="space-y-1 text-sm">
        <div class="flex gap-2">
          <span class="text-zinc-500 w-12 shrink-0">From</span>
          <span class="text-zinc-900 dark:text-zinc-100">{email.fromAddress}</span>
        </div>
        <div class="flex gap-2">
          <span class="text-zinc-500 w-12 shrink-0">To</span>
          <span class="text-zinc-900 dark:text-zinc-100">{email.toAddress}</span>
        </div>
        <div class="flex gap-2">
          <span class="text-zinc-500 w-12 shrink-0">Date</span>
          <span class="text-zinc-900 dark:text-zinc-100">
            {new Date(email.receivedAt).toLocaleString()} ({timeAgo(email.receivedAt)})
          </span>
        </div>
        <div class="flex gap-2">
          <span class="text-zinc-500 w-12 shrink-0">Size</span>
          <span class="text-zinc-900 dark:text-zinc-100">{formatBytes(email.rawSize)}</span>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 mb-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
      <button
        onclick={() => (activeTab = "text")}
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors {activeTab === 'text' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}"
      >
        <FileText class="h-3.5 w-3.5" />
        Text
      </button>
      <button
        onclick={() => (activeTab = "html")}
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors {activeTab === 'html' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}"
      >
        <Code class="h-3.5 w-3.5" />
        HTML
      </button>
      <button
        onclick={() => (activeTab = "headers")}
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors {activeTab === 'headers' ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}"
      >
        <List class="h-3.5 w-3.5" />
        Headers
      </button>
    </div>

    <!-- Body Content -->
    <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden mb-4">
      {#if activeTab === "text"}
        <div class="p-5">
          {#if email.textBody}
            <pre class="whitespace-pre-wrap text-sm text-zinc-800 dark:text-zinc-200 font-mono">{email.textBody}</pre>
          {:else}
            <p class="text-sm text-zinc-400 italic">No text body</p>
          {/if}
        </div>
      {:else if activeTab === "html"}
        <div class="p-0">
          {#if email.htmlBody}
            <iframe
              srcdoc={email.htmlBody}
              sandbox="allow-same-origin"
              class="w-full min-h-[400px] border-0"
              title="Email HTML content"
            ></iframe>
          {:else}
            <div class="p-5">
              <p class="text-sm text-zinc-400 italic">No HTML body</p>
            </div>
          {/if}
        </div>
      {:else}
        <div class="p-5">
          <pre class="whitespace-pre-wrap text-xs text-zinc-600 dark:text-zinc-400 font-mono">Message-ID: {email.messageId}
From: {email.fromAddress}
To: {email.toAddress}
Subject: {email.subject}
Date: {email.receivedAt}</pre>
        </div>
      {/if}
    </div>

    <!-- Attachments -->
    {#if email.attachments && email.attachments.length > 0}
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5">
        <h3 class="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">
          <Paperclip class="h-4 w-4" />
          Attachments ({email.attachments.length})
        </h3>
        <div class="space-y-2">
          {#each email.attachments as att}
            <a
              href={api.getAttachmentUrl(address, emailId, att.id)}
              target="_blank"
              rel="noopener"
              class="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
            >
              <div class="flex items-center gap-2 min-w-0">
                <Download class="h-4 w-4 text-zinc-500 shrink-0" />
                <span class="text-sm text-zinc-900 dark:text-zinc-100 truncate">{att.filename}</span>
              </div>
              <span class="text-xs text-zinc-500 shrink-0 ml-2">{formatBytes(att.size)}</span>
            </a>
          {/each}
        </div>
      </div>
    {/if}
  {/if}
</div>
