import { InboxService } from "../services/inbox.service";
import { CLEANUP_INTERVAL_MS } from "@mailuse/shared/constants";

let timer: ReturnType<typeof setInterval> | null = null;

export function startCleanupJob() {
  console.log(`[cleanup] Starting cleanup job (interval: ${CLEANUP_INTERVAL_MS / 1000}s)`);

  timer = setInterval(async () => {
    try {
      await InboxService.cleanupExpired();
    } catch (err) {
      console.error("[cleanup] Error during cleanup:", err);
    }
  }, CLEANUP_INTERVAL_MS);
}

export function stopCleanupJob() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}
