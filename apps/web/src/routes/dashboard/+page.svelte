<script lang="ts">
  import { api } from "$lib/api";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";
  import { timeAgo } from "$lib/utils";
  import { BarChart3, Inbox, Lock, Mail, RefreshCw, ShieldCheck } from "lucide-svelte";
  import { onMount } from "svelte";

  const TOKEN_KEY = "mailuse:owner-token";

  let password = $state("");
  let token = $state("");
  let error = $state("");
  let loading = $state(false);
  let stats = $state<any>(null);
  let latest = $state<any>(null);

  async function login() {
    loading = true;
    error = "";
    try {
      const result = await api.ownerLogin(password);
      token = result.token;
      localStorage.setItem(TOKEN_KEY, token);
      window.dispatchEvent(new Event("mailuse:owner-login"));
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
      const [nextStats, nextLatest] = await Promise.all([
        api.ownerStats(token),
        api.ownerLatestUpdate(token).catch(() => null),
      ]);
      stats = nextStats;
      latest = nextLatest;
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
    latest = null;
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
          <Button class="w-full" type="submit" disabled={loading || password.length === 0}>{loading ? "Checking..." : "Unlock dashboard"}</Button>
        </form>
      </Card.Content>
    </Card.Root>
  </div>
{:else}
  <div class="min-h-[calc(100vh-4rem)] bg-background p-4 sm:p-6 lg:p-8">
    <div class="mx-auto max-w-6xl space-y-6">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-muted-foreground">Owner dashboard</p>
          <h1 class="text-3xl font-semibold tracking-tight">Overview</h1>
        </div>
        <Button variant="outline" onclick={loadDashboard} disabled={loading}>
          <RefreshCw class="size-4 {loading ? 'animate-spin' : ''}" />
          Refresh
        </Button>
      </div>

      {#if error}
        <Card.Root class="border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
          <Card.Content class="p-4">{error}</Card.Content>
        </Card.Root>
      {/if}

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {#each [
          ["Total inboxes", stats?.totalInboxes ?? 0, Inbox],
          ["Active", stats?.activeInboxes ?? 0, ShieldCheck],
          ["Deleted", stats?.deletedInboxes ?? 0, BarChart3],
          ["Total emails", stats?.totalEmails ?? 0, Mail],
          ["24h emails", stats?.emailsToday ?? 0, BarChart3],
        ] as item}
          {@const Icon = item[2]}
          <Card.Root>
            <Card.Content class="p-4">
              <div class="mb-3 flex items-center justify-between">
                <p class="text-xs text-muted-foreground">{item[0]}</p>
                <Icon class="size-4 text-muted-foreground" />
              </div>
              <p class="text-2xl font-semibold">{item[1]}</p>
            </Card.Content>
          </Card.Root>
        {/each}
      </div>

      <Card.Root class={latest?.updateAvailable ? "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20" : ""}>
        <Card.Header>
          <div class="flex items-start justify-between gap-4">
            <div>
              <Card.Title>{latest?.updateAvailable ? "Update available" : "System update"}</Card.Title>
              <Card.Description>
                {#if latest}
                  Current {latest.currentVersion}, latest {latest.latestVersion}. Latest release {timeAgo(latest.publishedAt)}.
                {:else}
                  Release update status is unavailable right now.
                {/if}
              </Card.Description>
            </div>
            <Badge variant={latest?.updateAvailable ? "secondary" : "outline"}>{latest?.latestVersion || "unknown"}</Badge>
          </div>
        </Card.Header>
        <Card.Content class="flex flex-wrap gap-2">
          <Button href="/dashboard/updates">Open update page</Button>
          {#if latest?.url}
            <Button href={latest.url} target="_blank" variant="outline">View release</Button>
          {/if}
        </Card.Content>
      </Card.Root>
    </div>
  </div>
{/if}
