<script lang="ts">
  import { ArrowRight, Mail } from "@lucide/svelte";
</script>

<header class="bg-[#FFF7E8] px-4 py-4 dark:bg-slate-950">
  <div class="container mx-auto flex max-w-6xl items-center justify-between rounded-3xl border-4 border-slate-900 bg-white px-4 py-3 shadow-[6px_6px_0_#0f172a] dark:bg-slate-900 dark:shadow-[6px_6px_0_#f8fafc]">
    <a
      href="/"
      class="flex cursor-pointer items-center gap-2 text-lg font-black text-slate-950 transition-colors duration-200 hover:text-[#6366F1] dark:text-slate-100"
    >
      <span class="rounded-2xl border-2 border-slate-900 bg-[#FFD166] p-2 text-slate-950">
        <Mail class="h-4 w-4" />
      </span>
      <span>mailuse</span>
    </a>
    <nav
      class="flex items-center gap-3 text-sm font-black text-slate-700 dark:text-slate-300"
    >
      <a
        href="/#features"
        class="hidden cursor-pointer transition-colors duration-200 hover:text-[#6366F1] sm:inline"
      >
        Features
      </a>
      <a
        href="/docs"
        class="inline-flex cursor-pointer items-center gap-2 rounded-2xl border-2 border-slate-900 bg-[#22C55E] px-3 py-2 text-slate-950 transition-colors duration-200 hover:bg-[#86EFAC]"
      >
        Docs
        <ArrowRight class="h-4 w-4" />
      </a>
      <a
        href="https://github.com/MrPinguiiin/mailuse"
        class="hidden cursor-pointer transition-colors duration-200 hover:text-[#6366F1] sm:inline"
        target="_blank"
        rel="noreferrer"
      >
        GitHub
      </a>
    </nav>
  </div>
</header>
