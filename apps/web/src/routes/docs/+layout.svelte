<script lang="ts">
  import { page } from "$app/state";
  import {
    BookOpen,
    Code2,
    Container,
    ExternalLink,
    Globe2,
    Home,
    Rocket,
    Search,
    Server,
  } from "@lucide/svelte";

  const groups = [
    {
      title: "Getting Started",
      links: [
        { href: "/docs", label: "Introduction", icon: Home },
        { href: "/docs/self-hosting", label: "Self-hosting", icon: Server },
        { href: "/docs/docker", label: "Docker Deployment", icon: Container },
      ],
    },
    {
      title: "Configuration",
      links: [{ href: "/docs/dns", label: "DNS & Mail Routing", icon: Globe2 }],
    },
    {
      title: "API References",
      links: [{ href: "/docs/api", label: "API Endpoints", icon: Code2 }],
    },
  ];

  const { children } = $props();

  const isActive = (href: string) =>
    href === "/docs" ? page.url.pathname === href : page.url.pathname.startsWith(href);
</script>

<div class="border-y-4 border-slate-900 bg-[#FFF7E8] py-3 dark:bg-slate-950">
  <div class="container mx-auto flex max-w-7xl items-center gap-3 px-4">
    <div class="hidden min-w-0 flex-1 items-center gap-2 rounded-2xl border-4 border-slate-900 bg-white px-4 py-3 text-sm font-bold text-slate-500 shadow-[5px_5px_0_#0f172a] dark:bg-slate-900 md:flex">
      <Search class="h-4 w-4" />
      <span>Search documentation...</span>
      <kbd class="ml-auto rounded-lg border-2 border-slate-900 bg-[#FFD166] px-2 py-1 text-[10px] font-black text-slate-950">⌘K</kbd>
    </div>
    <a
      href="/docs/self-hosting"
      class="inline-flex cursor-pointer items-center gap-2 rounded-2xl border-4 border-slate-900 bg-[#22C55E] px-4 py-3 text-sm font-black text-slate-950 shadow-[5px_5px_0_#0f172a] transition-colors duration-200 hover:bg-[#86EFAC]"
    >
      <Rocket class="h-4 w-4" />
      Install
    </a>
    <a
      href="https://github.com/MrPinguiiin/mailuse"
      target="_blank"
      rel="noreferrer"
      class="inline-flex cursor-pointer items-center gap-2 rounded-2xl border-4 border-slate-900 bg-white px-4 py-3 text-sm font-black text-slate-950 shadow-[5px_5px_0_#0f172a] transition-colors duration-200 hover:bg-[#FFD166] dark:bg-slate-900 dark:text-slate-50"
    >
      GitHub
      <ExternalLink class="h-3.5 w-3.5" />
    </a>
  </div>
</div>

<div class="bg-[#FFF7E8] dark:bg-slate-950">
<div class="container mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-[260px_1fr] lg:grid-cols-[280px_1fr_180px]">
  <aside class="hidden py-8 pr-2 md:block">
    <div class="sticky top-6 space-y-7">
      <div class="rounded-[1.75rem] border-4 border-slate-900 bg-white p-5 shadow-[7px_7px_0_#0f172a] dark:bg-slate-900">
        <a href="/docs" class="mb-3 flex cursor-pointer items-center gap-2 text-base font-black text-slate-950 transition-colors duration-200 hover:text-[#6366F1] dark:text-slate-50">
          <span class="rounded-2xl border-2 border-slate-900 bg-[#A5B4FC] p-2 text-slate-950">
            <BookOpen class="h-4 w-4" />
          </span>
          mailuse docs
        </a>
        <p class="text-xs font-semibold leading-5 text-slate-600 dark:text-slate-300">
          Install, configure, and operate your own disposable email service.
        </p>
      </div>

      {#each groups as group}
        <nav>
          <p class="mb-2 px-2 text-xs font-black uppercase tracking-widest text-slate-500">{group.title}</p>
          <div class="space-y-1">
            {#each group.links as link}
              {@const Icon = link.icon}
              <a
                href={link.href}
                class="flex cursor-pointer items-center gap-2 rounded-2xl border-2 px-3 py-2 text-sm font-black transition-colors duration-200 {isActive(link.href)
                  ? 'border-slate-900 bg-[#FFD166] text-slate-950 shadow-[4px_4px_0_#0f172a]'
                  : 'border-transparent text-slate-600 hover:border-slate-900 hover:bg-white hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-50'}"
              >
                <Icon class="h-4 w-4" />
                {link.label}
              </a>
            {/each}
          </div>
        </nav>
      {/each}

      <div class="rounded-[1.5rem] border-4 border-slate-900 bg-[#8AE9C1] p-4 text-slate-950 shadow-[6px_6px_0_#0f172a]">
        <p class="mb-1 text-sm font-black">Need a VPS?</p>
        <p class="mb-3 text-xs font-semibold leading-5 text-slate-700">
          mailuse needs a VPS for SMTP port 25. Vercel is only for public docs/web.
        </p>
        <a href="/docs/self-hosting" class="cursor-pointer text-xs font-black text-slate-950 underline underline-offset-4">
          Read self-hosting guide
        </a>
      </div>
    </div>
  </aside>

  <main class="min-w-0 py-8">
    {@render children()}
  </main>

  <aside class="hidden py-8 lg:block">
    <div class="sticky top-6 rounded-[1.5rem] border-4 border-slate-900 bg-white p-4 shadow-[6px_6px_0_#0f172a] dark:bg-slate-900">
      <p class="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">On this site</p>
      <div class="space-y-2 text-sm font-bold">
        <a href="/docs" class="block cursor-pointer text-slate-500 transition-colors duration-200 hover:text-[#6366F1] dark:text-slate-400">Overview</a>
        <a href="/docs/self-hosting" class="block cursor-pointer text-slate-500 transition-colors duration-200 hover:text-[#6366F1] dark:text-slate-400">Self-hosting</a>
        <a href="/docs/api" class="block cursor-pointer text-slate-500 transition-colors duration-200 hover:text-[#6366F1] dark:text-slate-400">API</a>
      </div>
    </div>
  </aside>
</div>
</div>
