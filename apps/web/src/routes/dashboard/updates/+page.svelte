<script lang="ts">
  import { api } from "$lib/api";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";
  import { timeAgo } from "$lib/utils";
  import { ExternalLink, RefreshCw, Rocket } from "lucide-svelte";
  import { onMount } from "svelte";

  const TOKEN_KEY = "mailuse:owner-token";
  const CHECK_MS = 6 * 60 * 60 * 1000;

  let token = $state("");
  let latest = $state<any>(null);
  let job = $state<any>(null);
  let loading = $state(false);
  let error = $state("");
  let pollTimer: ReturnType<typeof setInterval> | null = null;

  async function checkLatest() {
    if (!token) return;
    loading = true;
    error = "";
    try {
      latest = await api.ownerLatestUpdate(token);
    } catch (e: any) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  async function triggerUpdate() {
    loading = true;
    error = "";
    try {
      const result = await api.ownerTriggerUpdate(token);
      job = { id: result.jobId, status: "pending", logs: "" };
      startPolling(result.jobId);
    } catch (e: any) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  function startPolling(jobId: string) {
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = setInterval(async () => {
      job = await api.ownerUpdateStatus(token, jobId);
      if (["success", "failed"].includes(job.status)) {
        if (pollTimer) clearInterval(pollTimer);
      }
    }, 2000);
  }

  onMount(() => {
    token = localStorage.getItem(TOKEN_KEY) || "";
    checkLatest();
    const interval = setInterval(checkLatest, CHECK_MS);
    return () => {
      clearInterval(interval);
      if (pollTimer) clearInterval(pollTimer);
    };
  });
</script>

<div class="p-4 sm:p-6 lg:p-8">
  <div class="mx-auto max-w-5xl space-y-6">
    <div>
      <p class="text-sm text-muted-foreground">Release updates</p>
      <h1 class="text-3xl font-semibold tracking-tight">One-click updater</h1>
    </div>

    {#if error}
      <Card.Root class="border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
        <Card.Content class="p-4">{error}</Card.Content>
      </Card.Root>
    {/if}

    <Card.Root>
      <Card.Header>
        <div class="flex items-start justify-between gap-4">
          <div>
            <Card.Title>{latest?.updateAvailable ? "Update available" : "Release channel"}</Card.Title>
            <Card.Description>Updates are checked from the latest GitHub release, not commit hashes.</Card.Description>
          </div>
          <Badge variant={latest?.updateAvailable ? "secondary" : "outline"}>{latest?.latestVersion || "checking"}</Badge>
        </div>
      </Card.Header>
      <Card.Content class="space-y-4">
        {#if latest}
          <div class="rounded-lg border p-4">
            <p class="font-medium">{latest.name}</p>
            <p class="mt-1 text-sm text-muted-foreground">Current: {latest.currentVersion} / Latest: {latest.latestVersion}</p>
            <p class="mt-1 text-xs text-muted-foreground">Published {timeAgo(latest.publishedAt)}</p>
          </div>
        {/if}
        <div class="flex flex-wrap gap-2">
          <Button onclick={checkLatest} variant="outline" disabled={loading}>
            <RefreshCw class="size-4 {loading ? 'animate-spin' : ''}" />
            Check now
          </Button>
          <Button onclick={triggerUpdate} disabled={loading || !latest?.updateAvailable}>
            <Rocket class="size-4" />
            Update now
          </Button>
          {#if latest?.url}
            <Button href={latest.url} target="_blank" variant="outline">
              <ExternalLink class="size-4" />
              View release
            </Button>
          {/if}
        </div>
      </Card.Content>
    </Card.Root>

    {#if job}
      <Card.Root>
        <Card.Header>
          <Card.Title>Update progress</Card.Title>
          <Card.Description>Status: {job.status} {job.phase ? ` / ${job.phase}` : ""}</Card.Description>
        </Card.Header>
        <Card.Content>
          <pre class="max-h-[480px] overflow-auto rounded-lg bg-zinc-950 p-4 text-xs text-zinc-100"><code>{job.logs || "Waiting for logs..."}</code></pre>
        </Card.Content>
      </Card.Root>
    {/if}
  </div>
</div>
