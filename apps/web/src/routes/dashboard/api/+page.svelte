<script lang="ts">
  import { api } from "$lib/api";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";
  import { onMount } from "svelte";

  const TOKEN_KEY = "mailuse:owner-token";
  let token = $state("");
  let apiInfo = $state<any>(null);

  onMount(async () => {
    token = localStorage.getItem(TOKEN_KEY) || "";
    if (token) apiInfo = await api.ownerApi(token);
  });
</script>

<div class="p-4 sm:p-6 lg:p-8">
  <div class="mx-auto max-w-4xl space-y-6">
    <div>
      <p class="text-sm text-muted-foreground">Owner API</p>
      <h1 class="text-3xl font-semibold tracking-tight">API token</h1>
    </div>
    <Card.Root>
      <Card.Content class="space-y-4 p-4">
        <div class="rounded-lg border bg-muted/40 p-3">
          <code class="block break-all text-xs">{apiInfo?.token}</code>
        </div>
        <Button onclick={() => navigator.clipboard.writeText(apiInfo?.token || "")}>Copy token</Button>
        <div class="space-y-2">
          {#each apiInfo?.endpoints || [] as endpoint}
            <div class="rounded-lg border p-3">
              <Badge variant="outline">{endpoint.method}</Badge>
              <code class="ml-2 text-xs">{endpoint.path}</code>
              <p class="mt-1 text-xs text-muted-foreground">{endpoint.description}</p>
            </div>
          {/each}
        </div>
      </Card.Content>
    </Card.Root>
  </div>
</div>
