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
  } from "lucide-svelte";

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

<div class="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
  <div class="container mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
    <div class="hidden min-w-0 flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 md:flex">
      <Search class="h-4 w-4" />
      <span>Search documentation...</span>
      <kbd class="ml-auto rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950">⌘K</kbd>
    </div>
    <a
      href="/docs/self-hosting"
      class="inline-flex items-center gap-2 rounded-lg bg-zinc-950 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
    >
      <Rocket class="h-4 w-4" />
      Install
    </a>
    <a
      href="https://github.com/MrPinguiiin/mailuse"
      target="_blank"
      rel="noreferrer"
      class="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-600"
    >
      GitHub
      <ExternalLink class="h-3.5 w-3.5" />
    </a>
  </div>
</div>

<div class="container mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-[260px_1fr] lg:grid-cols-[280px_1fr_180px]">
  <aside class="hidden border-r border-zinc-200 py-8 pr-5 dark:border-zinc-800 md:block">
    <div class="sticky top-6 space-y-7">
      <div>
        <a href="/docs" class="mb-2 flex items-center gap-2 text-base font-bold text-zinc-950 dark:text-zinc-50">
          <BookOpen class="h-5 w-5" />
          mailuse docs
        </a>
        <p class="text-xs leading-5 text-zinc-500">
          Install, configure, and operate your own disposable email service.
        </p>
      </div>

      {#each groups as group}
        <nav>
          <p class="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">{group.title}</p>
          <div class="space-y-1">
            {#each group.links as link}
              {@const Icon = link.icon}
              <a
                href={link.href}
                class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors {isActive(link.href)
                  ? 'bg-zinc-100 font-semibold text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50'
                  : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50'}"
              >
                <Icon class="h-4 w-4" />
                {link.label}
              </a>
            {/each}
          </div>
        </nav>
      {/each}

      <div class="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
        <p class="mb-1 text-sm font-semibold text-zinc-950 dark:text-zinc-50">Need a VPS?</p>
        <p class="mb-3 text-xs leading-5 text-zinc-500">
          mailuse needs a VPS for SMTP port 25. Vercel is only for public docs/web.
        </p>
        <a href="/docs/self-hosting" class="text-xs font-semibold text-zinc-950 underline underline-offset-4 dark:text-zinc-50">
          Read self-hosting guide
        </a>
      </div>
    </div>
  </aside>

  <main class="min-w-0 py-8">
    {@render children()}
  </main>

  <aside class="hidden py-8 lg:block">
    <div class="sticky top-6 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <p class="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">On this site</p>
      <div class="space-y-2 text-sm">
        <a href="/docs" class="block text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50">Overview</a>
        <a href="/docs/self-hosting" class="block text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50">Self-hosting</a>
        <a href="/docs/api" class="block text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50">API</a>
      </div>
    </div>
  </aside>
</div>
