<script lang="ts">
  import { page } from "$app/state";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import { Separator } from "$lib/components/ui/separator";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import { api } from "$lib/api";
  import { rememberInbox } from "$lib/recent-inboxes";
  import { cn } from "$lib/utils";
  import { timeAgo, formatBytes, timeRemaining } from "$lib/utils";
  import { Check, Clock, Copy, Inbox, Mail, RefreshCw, ShieldCheck, Trash2, Zap } from "@lucide/svelte";
  import { POLLING_INTERVAL_MS } from "@mailuse/shared/constants";
  import type { Inbox as InboxType, EmailSummary } from "@mailuse/shared/types";

  const address = $derived(decodeURIComponent(page.params.address));

  let inbox = $state<InboxType | null>(null);
  let emails = $state<EmailSummary[]>([]);
  let loading = $state(true);
  let error = $state("");
  let copied = $state(false);
  let refreshing = $state(false);
  let pollingTick = $state(0);
  let secondsUntilPoll = $state(POLLING_INTERVAL_MS / 1000);
  let pollTimer: ReturnType<typeof setInterval> | null = null;
  let countdownTimer: ReturnType<typeof setInterval> | null = null;

  const latestEmail = $derived(emails[0]);

  async function loadInbox() {
    try {
      inbox = await api.getInbox(address);
      rememberInbox(inbox);
    } catch (e: any) {
      error = e.message;
    }
  }

  async function loadEmails() {
    try {
      const result = await api.listEmails(address);
      emails = result.emails;
    } catch {
      // Inbox might not exist yet.
    } finally {
      loading = false;
    }
  }

  async function refresh() {
    refreshing = true;
    secondsUntilPoll = POLLING_INTERVAL_MS / 1000;
    loading = emails.length === 0;
    await Promise.all([loadInbox(), loadEmails()]);
    pollingTick += 1;
    refreshing = false;
    loading = false;
  }

  async function deleteInbox() {
    if (!confirm("Delete this inbox and all emails?")) return;
    try {
      await api.deleteInbox(address);
      window.location.href = "/new";
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
    pollTimer = setInterval(async () => {
      refreshing = true;
      secondsUntilPoll = POLLING_INTERVAL_MS / 1000;
      await loadEmails();
      pollingTick += 1;
      refreshing = false;
    }, POLLING_INTERVAL_MS);

    countdownTimer = setInterval(() => {
      secondsUntilPoll = secondsUntilPoll <= 1 ? POLLING_INTERVAL_MS / 1000 : secondsUntilPoll - 1;
    }, 1000);
  }

  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
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

<div class="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_top_left,rgba(24,24,27,0.08),transparent_32rem)] px-4 py-6 dark:bg-[radial-gradient(circle_at_top_left,rgba(244,244,245,0.08),transparent_32rem)] sm:py-10">
  <div class="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
    <aside class="space-y-4">
      <Card.Root class="overflow-hidden border-zinc-200/80 bg-white/85 shadow-sm backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-950/80">
        <Card.Header class="space-y-4">
          <div class="flex items-center justify-between gap-3">
            <Badge variant="secondary" class="gap-1.5 rounded-full px-3 py-1">
              <span class="relative flex h-2.5 w-2.5">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70"></span>
                <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              </span>
              Watching for mail
            </Badge>
            <Badge variant="outline" class="rounded-full">next check in {secondsUntilPoll}s</Badge>
          </div>

          <div class="space-y-2">
            <Card.Title class="break-all font-mono text-xl leading-tight">{address}</Card.Title>
            <Card.Description>Receive disposable email on your own domain with no signup flow.</Card.Description>
          </div>
        </Card.Header>

        <Card.Content class="space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-xl border bg-zinc-50 p-3 dark:bg-zinc-900/60">
              <p class="text-xs text-muted-foreground">Messages</p>
              <p class="mt-1 text-2xl font-semibold">{emails.length}</p>
            </div>
            <div class="rounded-xl border bg-zinc-50 p-3 dark:bg-zinc-900/60">
              <p class="text-xs text-muted-foreground">Expires</p>
              <p class="mt-1 truncate text-sm font-medium">{inbox?.expiresAt ? timeRemaining(inbox.expiresAt) : "Active"}</p>
            </div>
          </div>

          {#if latestEmail}
            <div class="rounded-xl border bg-zinc-50 p-3 dark:bg-zinc-900/60">
              <p class="text-xs text-muted-foreground">Latest sender</p>
              <p class="mt-1 truncate text-sm font-medium">{latestEmail.fromAddress}</p>
              <p class="mt-1 text-xs text-muted-foreground">{timeAgo(latestEmail.receivedAt)}</p>
            </div>
          {/if}

          <Separator />

          <div class="rounded-xl border bg-zinc-50 p-3 dark:bg-zinc-900/60">
            <div class="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span class="flex items-center gap-1.5">
                <RefreshCw class={cn("size-3.5", refreshing && "animate-spin text-emerald-500")} />
                {refreshing ? "Checking mailbox..." : "Auto-refresh active"}
              </span>
              <span>#{pollingTick}</span>
            </div>
            <div class="h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div
                class="h-full rounded-full bg-emerald-500 transition-all duration-1000 ease-linear"
                style={`width: ${Math.max(4, ((POLLING_INTERVAL_MS / 1000 - secondsUntilPoll) / (POLLING_INTERVAL_MS / 1000)) * 100)}%`}
              ></div>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <Button variant="secondary" onclick={copyAddress} class="flex-1">
              {#if copied}
                <Check class="size-4" />
                Copied
              {:else}
                <Copy class="size-4" />
                Copy address
              {/if}
            </Button>
            <Button variant="outline" size="icon" onclick={refresh} title="Refresh inbox">
              <RefreshCw class={cn("size-4", refreshing && "animate-spin")} />
            </Button>
            <Button variant="destructive" size="icon" onclick={deleteInbox} title="Delete inbox">
              <Trash2 class="size-4" />
            </Button>
          </div>
        </Card.Content>
      </Card.Root>

      <Card.Root class="border-dashed bg-transparent shadow-none">
        <Card.Content class="grid gap-3 p-4 text-sm text-muted-foreground">
          <div class="flex items-center gap-2">
            <Zap class="size-4 text-amber-500" />
            New mail appears automatically.
          </div>
          <div class="flex items-center gap-2">
            <ShieldCheck class="size-4 text-emerald-500" />
            Data stays on your VPS.
          </div>
          <div class="flex items-center gap-2">
            <Clock class="size-4 text-sky-500" />
            TTL cleanup follows server config.
          </div>
        </Card.Content>
      </Card.Root>
    </aside>

    <main class="space-y-4">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p class="text-sm font-medium text-muted-foreground">Inbox</p>
          <h1 class="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">Messages</h1>
        </div>
        <Button href="/new" variant="outline">Create another inbox</Button>
      </div>

      {#if error}
        <Card.Root class="border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          <Card.Content class="p-5">{error}</Card.Content>
        </Card.Root>
      {:else if loading && emails.length === 0}
        <div class="space-y-3">
          {#each Array(4) as _}
            <Card.Root>
              <Card.Content class="flex items-center gap-4 p-4">
                <Skeleton class="size-10 rounded-full" />
                <div class="flex-1 space-y-2">
                  <Skeleton class="h-4 w-2/3" />
                  <Skeleton class="h-3 w-1/3" />
                </div>
                <Skeleton class="h-4 w-16" />
              </Card.Content>
            </Card.Root>
          {/each}
        </div>
      {:else if emails.length === 0}
        <Card.Root class="border-dashed bg-white/60 dark:bg-zinc-950/50">
          <Card.Content class="flex min-h-80 flex-col items-center justify-center p-8 text-center">
            <div class="mb-4 rounded-2xl border bg-zinc-50 p-4 dark:bg-zinc-900">
              <Inbox class="size-9 text-muted-foreground" />
            </div>
            <h2 class="text-lg font-semibold">No emails yet</h2>
            <p class="mt-1 max-w-md text-sm text-muted-foreground">
              Send an email to <span class="font-mono font-medium text-foreground">{address}</span> and it will appear here automatically.
            </p>
          </Card.Content>
        </Card.Root>
      {:else}
        <div class="space-y-3">
          {#each emails as email}
            <Card.Root class="group transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:hover:border-zinc-700">
              <a href="/inbox/{encodeURIComponent(address)}/{email.id}" class="block">
                <Card.Content class="p-4 sm:p-5">
                  <div class="flex gap-4">
                    <div class="mt-1 hidden rounded-2xl border bg-zinc-50 p-3 transition group-hover:bg-zinc-100 dark:bg-zinc-900 dark:group-hover:bg-zinc-800 sm:block">
                      <Mail class="size-5 text-muted-foreground" />
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div class="min-w-0">
                          <h2 class="truncate text-base font-semibold text-zinc-950 dark:text-zinc-50">{email.subject || "(no subject)"}</h2>
                          <p class="mt-1 truncate text-sm text-muted-foreground">{email.fromAddress}</p>
                        </div>
                        <div class="flex shrink-0 items-center gap-2 text-xs text-muted-foreground sm:text-right">
                          <span>{timeAgo(email.receivedAt)}</span>
                          <span class="hidden sm:inline">/</span>
                          <span>{formatBytes(email.rawSize)}</span>
                        </div>
                      </div>
                      <div class="mt-3 flex flex-wrap gap-2">
                        <Badge variant="outline">Received</Badge>
                        {#if email.hasAttachments}
                          <Badge variant="secondary">Attachments</Badge>
                        {/if}
                      </div>
                    </div>
                  </div>
                </Card.Content>
              </a>
            </Card.Root>
          {/each}
        </div>
      {/if}
    </main>
  </div>
</div>
