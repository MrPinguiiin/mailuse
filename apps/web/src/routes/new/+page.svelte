<script lang="ts">
  import { goto } from "$app/navigation";
  import { env } from "$env/dynamic/public";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import { Separator } from "$lib/components/ui/separator";
  import { api } from "$lib/api";
  import { getRecentInboxes, rememberInbox, type RecentInbox } from "$lib/recent-inboxes";
  import { cn, timeRemaining } from "$lib/utils";
  import { Archive, Clock, Inbox, Mail, Plus, RefreshCw, Search, Shield, Trash2, Zap } from "@lucide/svelte";
  import { onMount } from "svelte";

  let localPart = $state("");
  let ttlMinutes = $state(60);
  let loading = $state(false);
  let error = $state("");
  let searchQuery = $state("");
  let recentInboxes = $state<RecentInbox[]>([]);

  const emailDomain = env.PUBLIC_EMAIL_DOMAIN || env.PUBLIC_APP_DOMAIN || "localhost";
  const filteredInboxes = $derived(
    recentInboxes.filter((inbox) => inbox.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  function refreshRecentInboxes() {
    recentInboxes = getRecentInboxes();
  }

  async function createInbox() {
    loading = true;
    error = "";

    try {
      const inbox = await api.createInbox({
        localPart: localPart || undefined,
        ttlMinutes,
      });
      recentInboxes = rememberInbox(inbox);
      goto(`/inbox/${encodeURIComponent(inbox.address)}`);
    } catch (e: any) {
      error = e.message || "Failed to create inbox";
    } finally {
      loading = false;
    }
  }

  function openInbox(inbox: RecentInbox) {
    recentInboxes = rememberInbox(inbox);
    goto(`/inbox/${encodeURIComponent(inbox.address)}`);
  }

  onMount(refreshRecentInboxes);
</script>

<svelte:head>
  <title>Inbox dashboard - mailuse</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-4rem)] bg-background text-foreground">
  <aside class="hidden w-72 flex-col border-r bg-card/80 lg:flex">
    <div class="p-6">
      <div class="mb-8 flex items-center gap-3">
        <div class="flex size-11 items-center justify-center rounded-xl bg-zinc-950 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-950">
          <Mail class="size-6" />
        </div>
        <div>
          <h1 class="text-lg font-bold">mailuse</h1>
          <p class="text-xs text-muted-foreground">Disposable inboxes</p>
        </div>
      </div>

      <Button class="w-full" onclick={createInbox} disabled={loading}>
        {#if loading}
          <RefreshCw class="size-4 animate-spin" />
          Creating...
        {:else}
          <Plus class="size-4" />
          Generate inbox
        {/if}
      </Button>
    </div>

    <div class="px-4">
      <div class="relative mb-3">
        <Search class="absolute left-3 top-2.5 size-4 text-muted-foreground" />
        <input
          bind:value={searchQuery}
          placeholder="Search inboxes..."
          class="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-700"
        />
      </div>
    </div>

    <nav class="flex-1 overflow-y-auto px-4 pb-4">
      <div class="mb-2 rounded-lg bg-muted px-4 py-3 text-sm font-medium">
        <div class="flex items-center justify-between">
          <span>Recent inboxes</span>
          <Badge variant="secondary">{recentInboxes.length}</Badge>
        </div>
      </div>

      {#if filteredInboxes.length === 0}
        <div class="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          No recent inboxes yet. Generate one or open an inbox link to pin it here.
        </div>
      {:else}
        <div class="space-y-1">
          {#each filteredInboxes as inbox}
            <button
              type="button"
              onclick={() => openInbox(inbox)}
              class="w-full rounded-lg px-3 py-3 text-left transition hover:bg-muted"
            >
              <p class="truncate font-mono text-sm font-medium">{inbox.address}</p>
              <p class="mt-1 text-xs text-muted-foreground">{inbox.expiresAt ? timeRemaining(inbox.expiresAt) : "Active"}</p>
            </button>
          {/each}
        </div>
      {/if}
    </nav>

    <div class="border-t p-4">
      <p class="truncate text-center text-sm font-semibold">@{emailDomain}</p>
      <p class="mt-1 text-center text-xs text-muted-foreground">stored locally in this browser</p>
    </div>
  </aside>

  <main class="flex-1 overflow-y-auto">
    <div class="border-b bg-card/80 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
      <div class="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-muted-foreground">Inbox dashboard</p>
          <h1 class="text-2xl font-semibold tracking-tight">Create and reopen disposable inboxes</h1>
        </div>
        <Badge variant="outline" class="w-fit rounded-full px-3 py-1">Self-hosted on {emailDomain}</Badge>
      </div>
    </div>

    <div class="mx-auto grid max-w-5xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8 lg:py-10">
      <section class="space-y-6">
        <Card.Root class="overflow-hidden shadow-sm">
          <Card.Header class="border-b bg-zinc-50/70 dark:bg-zinc-900/50">
            <div class="flex items-start justify-between gap-4">
              <div>
                <Card.Title class="text-2xl">New disposable inbox</Card.Title>
                <Card.Description>Generate an address, use it for OTPs, then let it expire automatically.</Card.Description>
              </div>
              <div class="rounded-2xl bg-zinc-950 p-3 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-950">
                <Inbox class="size-6" />
              </div>
            </div>
          </Card.Header>

          <Card.Content class="p-6">
            <form onsubmit={(e) => { e.preventDefault(); createInbox(); }} class="space-y-5">
              <div>
                <label for="localPart" class="mb-2 block text-sm font-medium">Custom address</label>
                <div class="flex overflow-hidden rounded-lg border bg-background focus-within:ring-2 focus-within:ring-zinc-400 dark:focus-within:ring-zinc-700">
                  <input
                    id="localPart"
                    type="text"
                    bind:value={localPart}
                    placeholder="random"
                    class="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none"
                  />
                  <div class="flex items-center border-l bg-muted px-3 font-mono text-sm text-muted-foreground">@{emailDomain}</div>
                </div>
                <p class="mt-2 text-xs text-muted-foreground">Leave empty to generate a random address.</p>
              </div>

              <div>
                <label for="ttl" class="mb-2 block text-sm font-medium">Expires in</label>
                <select
                  id="ttl"
                  bind:value={ttlMinutes}
                  class="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-700"
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
                <div class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                  {error}
                </div>
              {/if}

              <Button type="submit" class="w-full" size="lg" disabled={loading}>
                {#if loading}
                  <RefreshCw class="size-4 animate-spin" />
                  Creating inbox...
                {:else}
                  <Plus class="size-4" />
                  Generate and open inbox
                {/if}
              </Button>
            </form>
          </Card.Content>
        </Card.Root>

        <div class="grid gap-3 sm:grid-cols-3">
          <Card.Root class="bg-card/70">
            <Card.Content class="flex gap-3 p-4">
              <Zap class="mt-0.5 size-5 text-amber-500" />
              <div>
                <p class="text-sm font-medium">Instant</p>
                <p class="text-xs text-muted-foreground">No signup, no verification</p>
              </div>
            </Card.Content>
          </Card.Root>
          <Card.Root class="bg-card/70">
            <Card.Content class="flex gap-3 p-4">
              <Clock class="mt-0.5 size-5 text-sky-500" />
              <div>
                <p class="text-sm font-medium">Auto-expire</p>
                <p class="text-xs text-muted-foreground">Old inboxes clean up</p>
              </div>
            </Card.Content>
          </Card.Root>
          <Card.Root class="bg-card/70">
            <Card.Content class="flex gap-3 p-4">
              <Shield class="mt-0.5 size-5 text-emerald-500" />
              <div>
                <p class="text-sm font-medium">Private</p>
                <p class="text-xs text-muted-foreground">Stored on your VPS</p>
              </div>
            </Card.Content>
          </Card.Root>
        </div>
      </section>

      <aside class="space-y-4 lg:hidden">
        <Card.Root>
          <Card.Header>
            <Card.Title class="text-base">Recent inboxes</Card.Title>
            <Card.Description>Saved in this browser only.</Card.Description>
          </Card.Header>
          <Card.Content class="space-y-2">
            {#if recentInboxes.length === 0}
              <p class="text-sm text-muted-foreground">No recent inboxes yet.</p>
            {:else}
              {#each recentInboxes as inbox}
                <Button variant="outline" class="w-full justify-start font-mono" onclick={() => openInbox(inbox)}>
                  {inbox.address}
                </Button>
              {/each}
            {/if}
          </Card.Content>
        </Card.Root>
      </aside>

      <aside class="hidden space-y-4 lg:block">
        <Card.Root>
          <Card.Header>
            <Card.Title class="text-base">How it works</Card.Title>
          </Card.Header>
          <Card.Content class="space-y-4 text-sm text-muted-foreground">
            <p>Generated addresses are remembered in local storage so users can reopen them from the sidebar.</p>
            <Separator />
            <p>Expired inboxes disappear from the sidebar automatically when the dashboard loads.</p>
            <Separator />
            <p>Inbound email is still stored on the VPS database, not in the browser.</p>
          </Card.Content>
        </Card.Root>

        <Card.Root class="border-dashed">
          <Card.Content class="flex items-start gap-3 p-4 text-sm text-muted-foreground">
            <Trash2 class="mt-0.5 size-4" />
            Local history is only a shortcut. Server cleanup still follows inbox expiry.
          </Card.Content>
        </Card.Root>
      </aside>
    </div>
  </main>
</div>
