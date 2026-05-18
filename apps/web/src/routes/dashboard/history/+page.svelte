<script lang="ts">
  import { api } from "$lib/api";
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";
  import { Progress } from "$lib/components/ui/progress";
  import { getUpdateLabel, getUpdateProgress } from "$lib/update-progress";
  import { timeAgo } from "$lib/utils";
  import { onMount } from "svelte";

  const TOKEN_KEY = "mailuse:owner-token";
  let token = $state("");
  let jobs = $state<any[]>([]);
  let error = $state("");

  async function loadHistory() {
    try {
      const result = await api.ownerUpdateHistory(token);
      jobs = result.jobs;
    } catch (e: any) {
      error = e.message;
    }
  }

  async function rollback(jobId: string) {
    if (!confirm("Rollback this update?")) return;
    await api.ownerRollback(token, jobId);
    await loadHistory();
  }

  onMount(() => {
    token = localStorage.getItem(TOKEN_KEY) || "";
    loadHistory();
  });
</script>

<div class="p-4 sm:p-6 lg:p-8">
  <div class="mx-auto max-w-5xl space-y-6">
    <div>
      <p class="text-sm text-muted-foreground">Updates</p>
      <h1 class="text-3xl font-semibold tracking-tight">Update history</h1>
      <p class="mt-1 text-sm text-muted-foreground">Interrupted update jobs are marked failed automatically after they become stale.</p>
    </div>
    {#if error}<p class="text-sm text-red-600">{error}</p>{/if}
    <Card.Root>
      <Card.Content class="space-y-3 p-4">
        {#if jobs.length === 0}
          <p class="text-sm text-muted-foreground">No updates yet.</p>
        {:else}
          {#each jobs as job}
            <div class="rounded-lg border p-4">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="mb-1 flex items-center gap-2">
                    <Badge>{job.status}</Badge>
                    <span class="font-mono text-xs">{job.fromVersion} -> {job.toVersion}</span>
                  </div>
                  <p class="text-sm text-muted-foreground">{job.releaseName || job.strategy} / {timeAgo(job.startedAt)}</p>
                  {#if ["pending", "running"].includes(job.status)}
                    <div class="mt-3 max-w-md space-y-2 rounded-lg bg-muted/40 p-3">
                      <div class="flex items-center justify-between gap-3 text-sm">
                        <span class="font-medium">{getUpdateLabel(job)}</span>
                        <span class="text-xs text-muted-foreground">{getUpdateProgress(job)}%</span>
                      </div>
                      <Progress value={getUpdateProgress(job)} max={100} />
                      <p class="text-xs text-muted-foreground">Status: {job.status}{job.phase ? ` / ${job.phase}` : ""}</p>
                    </div>
                  {/if}
                  {#if job.status === "failed" && job.errorMessage}<p class="mt-2 text-sm text-red-600">{job.errorMessage}</p>{/if}
                </div>
                {#if job.status === "success" && job.backupPath}
                  <Button size="sm" variant="outline" onclick={() => rollback(job.id)}>Rollback</Button>
                {/if}
              </div>
            </div>
          {/each}
        {/if}
      </Card.Content>
    </Card.Root>
  </div>
</div>
