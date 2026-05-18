<script lang="ts">
  import { api } from "$lib/api";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";
  import * as Card from "$lib/components/ui/card";
  import { timeAgo } from "$lib/utils";
  import { Globe2, Inbox, RefreshCw } from "@lucide/svelte";
  import { onMount } from "svelte";

  const TOKEN_KEY = "mailuse:owner-token";

  type OwnerDomain = {
    id: string;
    domain: string;
    providerType: string;
    isActive: boolean;
    createdAt: string;
    inboxCount: number;
  };

  let token = $state("");
  let domains = $state<OwnerDomain[]>([]);
  let loading = $state(false);
  let error = $state("");

  async function loadDomains() {
    if (!token) return;
    loading = true;
    error = "";
    try {
      const result = await api.ownerDomains(token);
      domains = result.domains;
    } catch (e: any) {
      error = e.message || "Failed to load domains";
      if (e.message === "Unauthorized") {
        localStorage.removeItem(TOKEN_KEY);
        window.location.href = "/dashboard";
      }
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    token = localStorage.getItem(TOKEN_KEY) || "";
    if (!token) {
      window.location.href = "/dashboard";
      return;
    }
    loadDomains();
  });
</script>

<svelte:head>
  <title>Domains - mailuse owner</title>
</svelte:head>

<div class="p-4 sm:p-6 lg:p-8">
  <div class="mx-auto max-w-5xl space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-muted-foreground">Registered domains</p>
        <h1 class="text-3xl font-semibold tracking-tight">Domains</h1>
      </div>
      <Button variant="outline" onclick={loadDomains} disabled={loading}>
        <RefreshCw class="size-4 {loading ? 'animate-spin' : ''}" />
        Refresh
      </Button>
    </div>

    {#if error}
      <Card.Root class="border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
        <Card.Content class="p-4">{error}</Card.Content>
      </Card.Root>
    {/if}

    <div class="grid gap-4 sm:grid-cols-2">
      <Card.Root>
        <Card.Content class="p-4">
          <div class="mb-3 flex items-center justify-between">
            <p class="text-xs text-muted-foreground">Total domains</p>
            <Globe2 class="size-4 text-muted-foreground" />
          </div>
          <p class="text-2xl font-semibold">{domains.length}</p>
        </Card.Content>
      </Card.Root>
      <Card.Root>
        <Card.Content class="p-4">
          <div class="mb-3 flex items-center justify-between">
            <p class="text-xs text-muted-foreground">Total inboxes</p>
            <Inbox class="size-4 text-muted-foreground" />
          </div>
          <p class="text-2xl font-semibold">{domains.reduce((sum, domain) => sum + domain.inboxCount, 0)}</p>
        </Card.Content>
      </Card.Root>
    </div>

    <Card.Root>
      <Card.Header>
        <Card.Title>Domain list</Card.Title>
        <Card.Description>Domains are registered automatically when an inbox or inbound email uses them.</Card.Description>
      </Card.Header>
      <Card.Content class="space-y-3 p-4 pt-0">
        {#if loading && domains.length === 0}
          <p class="text-sm text-muted-foreground">Loading domains...</p>
        {:else if domains.length === 0}
          <div class="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            No domains registered yet.
          </div>
        {:else}
          {#each domains as domain}
            <div class="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <p class="truncate font-medium">{domain.domain}</p>
                  <Badge variant={domain.isActive ? "secondary" : "outline"}>{domain.isActive ? "active" : "inactive"}</Badge>
                  <Badge variant="outline">{domain.providerType}</Badge>
                </div>
                <p class="mt-1 text-xs text-muted-foreground">Created {timeAgo(domain.createdAt)}</p>
              </div>
              <div class="flex items-center gap-2 text-sm text-muted-foreground">
                <Inbox class="size-4" />
                <span>{domain.inboxCount} inbox{domain.inboxCount === 1 ? "" : "es"}</span>
              </div>
            </div>
          {/each}
        {/if}
      </Card.Content>
    </Card.Root>
  </div>
</div>
