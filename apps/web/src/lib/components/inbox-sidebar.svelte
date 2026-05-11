<script lang="ts">
  import { goto } from "$app/navigation";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import { getRecentInboxes, rememberInbox, type RecentInbox } from "$lib/recent-inboxes";
  import { timeRemaining } from "$lib/utils";
  import { Inbox, Mail, Plus, Search } from "lucide-svelte";
  import { onMount } from "svelte";

  let { domain, activeAddress = "" }: { domain: string; activeAddress?: string } = $props();

  let searchQuery = $state("");
  let recentInboxes = $state<RecentInbox[]>([]);

  const filteredInboxes = $derived(
    recentInboxes.filter((inbox) => inbox.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  function openInbox(inbox: RecentInbox) {
    recentInboxes = rememberInbox(inbox);
    goto(`/inbox/${encodeURIComponent(inbox.address)}`);
  }

  onMount(() => {
    recentInboxes = getRecentInboxes();
  });
</script>

<aside class="hidden w-72 shrink-0 flex-col border-r bg-card/80 lg:flex">
  <div class="p-6">
    <div class="mb-6 flex items-center gap-3">
      <div class="flex size-11 items-center justify-center rounded-xl bg-zinc-950 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-950">
        <Mail class="size-6" />
      </div>
      <div>
        <h1 class="text-lg font-bold">mailuse</h1>
        <p class="text-xs text-muted-foreground">Disposable inboxes</p>
      </div>
    </div>

    <Button class="w-full" href="/new">
      <Plus class="size-4" />
      New inbox
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
        No recent inboxes yet.
      </div>
    {:else}
      <div class="space-y-1">
        {#each filteredInboxes as inbox}
          <button
            type="button"
            onclick={() => openInbox(inbox)}
            class="w-full rounded-lg px-3 py-3 text-left transition hover:bg-muted {activeAddress === inbox.address ? 'bg-muted ring-1 ring-border' : ''}"
          >
            <div class="flex items-start gap-2">
              <Inbox class="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div class="min-w-0 flex-1">
                <p class="truncate font-mono text-sm font-medium">{inbox.address}</p>
                <p class="mt-1 text-xs text-muted-foreground">{inbox.expiresAt ? timeRemaining(inbox.expiresAt) : "Active"}</p>
              </div>
            </div>
          </button>
        {/each}
      </div>
    {/if}
  </nav>

  <div class="border-t p-4">
    <p class="truncate text-center text-sm font-semibold">@{domain}</p>
    <p class="mt-1 text-center text-xs text-muted-foreground">local browser history</p>
  </div>
</aside>
