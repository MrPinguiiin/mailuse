<script lang="ts">
  import { Mail } from "@lucide/svelte";
</script>

<header
  class="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3"
>
  <div class="container mx-auto max-w-5xl flex items-center justify-between">
    <a
      href="/"
      class="flex items-center gap-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100"
    >
      <Mail class="h-5 w-5" />
      <span>mailuse</span>
    </a>
    <nav
      class="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400"
    >
      <a
        href="/"
        class="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      >
        New Inbox
      </a>
    </nav>
  </div>
</header>
