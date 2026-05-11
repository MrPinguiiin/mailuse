<script lang="ts">
  import { goto } from "$app/navigation";
  import { env } from "$env/dynamic/public";
  import InboxSidebar from "$lib/components/inbox-sidebar.svelte";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import { Separator } from "$lib/components/ui/separator";
  import { api } from "$lib/api";
  import { getRecentInboxes, rememberInbox, type RecentInbox } from "$lib/recent-inboxes";
  import { Inbox, Plus, RefreshCw, ShieldCheck, Timer, Zap } from "lucide-svelte";
  import { onMount } from "svelte";

  let localPart = $state("");
  let ttlMinutes = $state(60);
  let loading = $state(false);
  let error = $state("");
  let recentInboxes = $state<RecentInbox[]>([]);

  const emailDomain = env.PUBLIC_EMAIL_DOMAIN || env.PUBLIC_APP_DOMAIN || "localhost";

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

  onMount(() => {
    recentInboxes = getRecentInboxes();
  });
</script>

<svelte:head>
  <title>Inbox dashboard - mailuse</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-4rem)] bg-background text-foreground">
  <InboxSidebar domain={emailDomain} />

  <main class="flex-1 overflow-y-auto">
    <div class="border-b bg-card/80 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
      <div class="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <div>
          <p class="text-sm text-muted-foreground">Inbox dashboard</p>
          <h1 class="text-2xl font-semibold tracking-tight">Create an inbox</h1>
        </div>
        <Badge variant="outline" class="hidden rounded-full px-3 py-1 sm:inline-flex">{emailDomain}</Badge>
      </div>
    </div>

    <div class="mx-auto grid max-w-5xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8 lg:py-10">
      <section class="space-y-6">
        <Card.Root class="overflow-hidden shadow-sm">
          <Card.Header class="border-b bg-muted/35">
            <div class="flex items-start justify-between gap-4">
              <div class="space-y-1">
                <Card.Title class="text-2xl">New disposable inbox</Card.Title>
                <Card.Description>Choose an address for OTPs and short-lived signups.</Card.Description>
              </div>
              <div class="rounded-2xl border bg-background p-3">
                <Inbox class="size-6 text-muted-foreground" />
              </div>
            </div>
          </Card.Header>

          <Card.Content class="p-6">
            <form onsubmit={(e) => { e.preventDefault(); createInbox(); }} class="space-y-5">
              <div class="space-y-2">
                <label for="localPart" class="text-sm font-medium">Address</label>
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
                <p class="text-xs text-muted-foreground">Leave empty for a random address.</p>
              </div>

              <div class="space-y-2">
                <label for="ttl" class="text-sm font-medium">Lifetime</label>
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
                  Creating...
                {:else}
                  <Plus class="size-4" />
                  Generate and open inbox
                {/if}
              </Button>
            </form>
          </Card.Content>
        </Card.Root>

        <div class="grid gap-3 sm:grid-cols-3">
          <Card.Root>
            <Card.Content class="flex gap-3 p-4">
              <Zap class="mt-0.5 size-5 text-amber-500" />
              <div>
                <p class="text-sm font-medium">Instant</p>
                <p class="text-xs text-muted-foreground">Ready immediately</p>
              </div>
            </Card.Content>
          </Card.Root>
          <Card.Root>
            <Card.Content class="flex gap-3 p-4">
              <Timer class="mt-0.5 size-5 text-sky-500" />
              <div>
                <p class="text-sm font-medium">Temporary</p>
                <p class="text-xs text-muted-foreground">Expires on schedule</p>
              </div>
            </Card.Content>
          </Card.Root>
          <Card.Root>
            <Card.Content class="flex gap-3 p-4">
              <ShieldCheck class="mt-0.5 size-5 text-emerald-500" />
              <div>
                <p class="text-sm font-medium">Self-hosted</p>
                <p class="text-xs text-muted-foreground">Stored on your VPS</p>
              </div>
            </Card.Content>
          </Card.Root>
        </div>
      </section>

      <aside class="space-y-4">
        <Card.Root class="lg:hidden">
          <Card.Header>
            <Card.Title class="text-base">Recent inboxes</Card.Title>
            <Card.Description>Saved in this browser only.</Card.Description>
          </Card.Header>
          <Card.Content class="space-y-2">
            {#if recentInboxes.length === 0}
              <p class="text-sm text-muted-foreground">No recent inboxes yet.</p>
            {:else}
              {#each recentInboxes as inbox}
                <Button variant="outline" class="w-full justify-start truncate font-mono" onclick={() => openInbox(inbox)}>
                  {inbox.address}
                </Button>
              {/each}
            {/if}
          </Card.Content>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Card.Title class="text-base">How it works</Card.Title>
          </Card.Header>
          <Card.Content class="space-y-4 text-sm text-muted-foreground">
            <p>Recent inboxes are saved in localStorage so users can reopen them quickly.</p>
            <Separator />
            <p>Expired entries are removed from local history automatically.</p>
            <Separator />
            <p>Emails are stored on the VPS through the API, not in the browser.</p>
          </Card.Content>
        </Card.Root>
      </aside>
    </div>
  </main>
</div>
