export const updatePhaseProgress: Record<string, number> = {
  backup: 15,
  pull: 30,
  build: 55,
  switch: 78,
  health: 90,
  cleanup: 97,
  done: 100,
};

export function getUpdateProgress(job: any) {
  if (!job) return 0;
  if (job.status === "success") return 100;
  if (job.status === "failed") return updatePhaseProgress[job.phase] || 0;
  return updatePhaseProgress[job.phase] || 8;
}

export function getUpdateLabel(job: any) {
  if (!job) return "Ready";
  if (job.status === "success") return "Update completed";
  if (job.status === "failed") return "Update failed";
  if (job.phase === "backup") return "Backing up database";
  if (job.phase === "pull") return "Fetching release files";
  if (job.phase === "build") return "Building containers";
  if (job.phase === "switch") return "Switching services";
  if (job.phase === "health") return "Checking service health";
  if (job.phase === "cleanup") return "Cleaning up images";
  return "Preparing update";
}
