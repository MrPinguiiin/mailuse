<script lang="ts">
  import { api } from "$lib/api";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";
  import { Separator } from "$lib/components/ui/separator";
  import { formatBytes, timeAgo, timeRemaining } from "$lib/utils";
  import { BarChart3, KeyRound, Lock, Mail, RefreshCw, ShieldCheck } from "@lucide/svelte";
  import { onMount } from "svelte";

  const TOKEN_KEY = "mailuse:owner-token";

  let password = $state("");
  let token = $state("");
  let error = $state("");
  let loading = $state(false);
  let stats = $state<any>(null);
  let inboxes = $state<any[]>([]);
  let apiInfo = $state<{ token: string; endpoints: Array<{ method: string; path: string; description: string }> } | null>(null);

  async function login() {
    loading = true;
    error = "";
    try {
      const result = await api.ownerLogin(password);
      token = result.token;
      localStorage.setItem(TOKEN_KEY, token);
      await loadDashboard();
    } catch (e: any) {
      error = e.message || "Login failed";
    } finally {
      loading = false;
    }
  }

  async function loadDashboard() {
    if (!token) return;
    loading = true;
    error = "";
    try {
      const [nextStats, nextInboxes, nextApi] = await Promise.all([
        api.ownerStats(token),
        api.ownerInboxes(token),
        api.ownerApi(token),
      ]);
      stats = nextStats;
      inboxes = nextInboxes.inboxes;
      apiInfo = nextApi;
    } catch (e: any) {
      error = e.message || "Failed to load dashboard";
      if (e.message === "Unauthorized") logout();
    } finally {
      loading = false;
    }
  }

  function logout() {
    token = "";
    localStorage.removeItem(TOKEN_KEY);
    stats = null;
    inboxes = [];
    apiInfo = null;
  }

  function copyToken() {
    if (apiInfo?.token) navigator.clipboard.writeText(apiInfo.token);
  }

  onMount(() => {
    token = localStorage.getItem(TOKEN_KEY) || "";
    if (token) loadDashboard();
  });
</script>

<svelte:head>
  <title>Owner dashboard - mailuse</title>
</svelte:head>

{#if !token}
  <div class="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4">
    <Card.Root class="w-full max-w-md shadow-sm">
      <Card.Header class="text-center">
        <div class="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-zinc-950 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-950">
          <Lock class="size-6" />
        </div>
        <Card.Title>Owner dashboard</Card.Title>
        <Card.Description>Enter the owner password configured during VPS installation.</Card.Description>
      </Card.Header>
      <Card.Content>
        <form class="space-y-4" onsubmit={(e) => { e.preventDefault(); login(); }}>
          <input
            type="password"
            bind:value={password}
            placeholder="Owner password"
            class="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-700"
          />
          {#if error}
            <p class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">{error}</p>
          {/if}
          <Button class="w-full" type="submit" disabled={loading || password.length === 0}>
            {loading ? "Checking..." : "Unlock dashboard"}
          </Button>
        </form>
      </Card.Content>
    </Card.Root>
  </div>
{:else}
  <div class="min-h-[calc(100vh-4rem)] bg-background px-4 py-6 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-6xl space-y-6">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-muted-foreground">Owner dashboard</p>
          <h1 class="text-3xl font-semibold tracking-tight">mailuse operations</h1>
        </div>
        <div class="flex gap-2">
          <Button variant="outline" onclick={loadDashboard} disabled={loading}>
            <RefreshCw class="size-4 {loading ? 'animate-spin' : ''}" />
            Refresh
          </Button>
          <Button variant="secondary" onclick={logout}>Logout</Button>
        </div>
      </div>

      {#if error}
        <Card.Root class="border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          <Card.Content class="p-4">{error}</Card.Content>
        </Card.Root>
      {/if}

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {#each [
          ["Total inboxes", stats?.totalInboxes ?? 0, Mail],
          ["Active", stats?.activeInboxes ?? 0, ShieldCheck],
          ["Deleted", stats?.deletedInboxes ?? 0, BarChart3],
          ["Total emails", stats?.totalEmails ?? 0, Mail],
          ["24h emails", stats?.emailsToday ?? 0, BarChart3],
        ] as item}
          <Card.Root>
            <Card.Content class="p-4">
              <div class="mb-3 flex items-center justify-between">
                <p class="text-xs text-muted-foreground">{item[0]}</p>
                <svelte:component this={item[2]} class="size-4 text-muted-foreground" />
              </div>
              <p class="text-2xl font-semibold">{item[1]}</p>
            </Card.Content>
          </Card.Root>
        {/each}
      </div>

      <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Card.Root>
          <Card.Header>
            <Card.Title>Recent inboxes</Card.Title>
            <Card.Description>Latest 50 non-deleted inboxes created or receiving email.</Card.Description>
          </Card.Header>
          <Card.Content class="space-y-2">
            {#if inboxes.length === 0}
              <p class="text-sm text-muted-foreground">No inboxes yet.</p>
            {:else}
              {#each inboxes as inbox}
                <a href="/inbox/{encodeURIComponent(inbox.address)}" class="block rounded-lg border p-3 transition hover:bg-muted/60">
                  <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                      <p class="truncate font-mono text-sm font-medium">{inbox.address}</p>
                      <p class="mt-1 text-xs text-muted-foreground">
                        {inbox.lastEmailAt ? `Last mail ${timeAgo(inbox.lastEmailAt)}` : `Created ${timeAgo(inbox.createdAt)}`}
                      </p>
                    </div>
                    <div class="shrink-0 text-right">
                      <Badge variant="secondary">{inbox.emailCount} emails</Badge>
                      <p class="mt-1 text-xs text-muted-foreground">{inbox.expiresAt ? timeRemaining(inbox.expiresAt) : "Active"}</p>
                    </div>
                  </div>
                </a>
              {/each}
            {/if}
          </Card.Content>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <div class="flex items-center justify-between gap-3">
              <div>
                <Card.Title>Owner API</Card.Title>
                <Card.Description>Use this token for owner-only API access.</Card.Description>
              </div>
              <KeyRound class="size-5 text-muted-foreground" />
            </div>
          </Card.Header>
          <Card.Content class="space-y-4">
            <div class="rounded-lg border bg-muted/40 p-3">
              <p class="mb-2 text-xs font-medium text-muted-foreground">Bearer token</p>
              <code class="block break-all text-xs">{apiInfo?.token}</code>
            </div>
            <Button variant="outline" class="w-full" onclick={copyToken}>Copy token</Button>
            <Separator />
            <div class="space-y-2">
              {#each apiInfo?.endpoints || [] as endpoint}
                <div class="rounded-lg border p-3">
                  <div class="mb-1 flex items-center gap-2">
                    <Badge variant="outline">{endpoint.method}</Badge>
                    <code class="truncate text-xs">{endpoint.path}</code>
                  </div>
                  <p class="text-xs text-muted-foreground">{endpoint.description}</p>
                </div>
              {/each}
            </div>
          </Card.Content>
        </Card.Root>
      </div>
    </div>
  </div>
{/if}
