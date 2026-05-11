<script lang="ts">
  import { BookOpen, Cloud, Code2, Container, Globe2, Server } from "lucide-svelte";

  const cards = [
    {
      title: "Self-hosting",
      href: "/docs/self-hosting",
      description: "Prepare DNS, install Docker stack, verify SMTP, and debug production.",
      icon: Server,
    },
    {
      title: "Docker deploy",
      href: "/docs/docker",
      description: "Production compose stack, owner password, variables, logs, and services.",
      icon: Container,
    },
    {
      title: "DNS & mail routing",
      href: "/docs/dns",
      description: "MX, A records, dashboard/API/inbox subdomains, and SMTP testing.",
      icon: Globe2,
    },
    {
      title: "API reference",
      href: "/docs/api",
      description: "Public inbox endpoints and owner-only dashboard API endpoints.",
      icon: Code2,
    },
  ];
</script>

<svelte:head>
  <title>mailuse docs</title>
  <meta
    name="description"
    content="mailuse documentation for disposable email hosting, Docker deployment, DNS setup, and REST API usage."
  />
</svelte:head>

<div class="max-w-4xl">
  <div class="mb-10 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
    <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
      <BookOpen class="h-3.5 w-3.5" />
      Documentation
    </div>
    <h1 class="mb-3 text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
      mailuse docs
    </h1>
    <p class="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
      Self-hosted disposable email with public inbox UI, private owner dashboard, Hono REST API, SMTP receiver, and Docker-first deployment.
    </p>
  </div>

  <div class="grid gap-4 sm:grid-cols-2">
    {#each cards as card}
      {@const Icon = card.icon}
      <a
        href={card.href}
        class="group rounded-xl border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
      >
        <Icon class="mb-4 h-5 w-5 text-zinc-500" />
        <h2 class="mb-1 text-base font-semibold text-zinc-950 dark:text-zinc-50">
          {card.title}
        </h2>
        <p class="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {card.description}
        </p>
      </a>
    {/each}
  </div>

  <div class="mt-8 rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
    <div class="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
      <Cloud class="h-4 w-4" />
      Domain setup pattern
    </div>
    <p class="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
      Keep the public landing/docs on Vercel, then point <code class="rounded bg-zinc-200 px-1 py-0.5 dark:bg-zinc-800">api</code>, <code class="rounded bg-zinc-200 px-1 py-0.5 dark:bg-zinc-800">inbox</code>, <code class="rounded bg-zinc-200 px-1 py-0.5 dark:bg-zinc-800">dashboard</code>, and <code class="rounded bg-zinc-200 px-1 py-0.5 dark:bg-zinc-800">mail</code> to the VPS.
    </p>
  </div>
</div>
