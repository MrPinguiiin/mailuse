<script lang="ts">
  import { BookOpen, Cloud, Code2, Container, Globe2, Server } from "@lucide/svelte";

  const cards = [
    {
      title: "Self-hosting",
      href: "/docs/self-hosting",
      description: "Prepare DNS, install Docker stack, verify SMTP, and debug production.",
      icon: Server,
      color: "bg-[#FFD166]",
    },
    {
      title: "Docker deploy",
      href: "/docs/docker",
      description: "Production compose stack, owner password, variables, logs, and services.",
      icon: Container,
      color: "bg-[#8AE9C1]",
    },
    {
      title: "DNS & mail routing",
      href: "/docs/dns",
      description: "MX, A records, dashboard/API/inbox subdomains, and SMTP testing.",
      icon: Globe2,
      color: "bg-[#A5B4FC]",
    },
    {
      title: "API reference",
      href: "/docs/api",
      description: "Public inbox endpoints and owner-only dashboard API endpoints.",
      icon: Code2,
      color: "bg-[#FB7185]",
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
  <div class="relative mb-10 overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-white p-6 shadow-[10px_10px_0_#0f172a] dark:bg-slate-900 sm:p-8">
    <div class="absolute -right-8 -top-8 h-28 w-28 rounded-full border-4 border-slate-900 bg-[#FFD166]"></div>
    <div class="absolute -bottom-10 right-20 h-24 w-24 rounded-full border-4 border-slate-900 bg-[#8AE9C1]"></div>
    <div class="relative">
    <div class="mb-5 inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-[#A5B4FC] px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-950">
      <BookOpen class="h-4 w-4" />
      Documentation
    </div>
    <h1 class="mb-4 text-5xl font-black leading-none tracking-tight text-slate-950 dark:text-slate-50 sm:text-6xl">
      mailuse docs
    </h1>
    <p class="max-w-2xl text-lg font-semibold leading-8 text-slate-700 dark:text-slate-300">
      Self-hosted disposable email with public inbox UI, private owner dashboard, Hono REST API, SMTP receiver, and Docker-first deployment.
    </p>
    </div>
  </div>

  <div class="grid gap-5 sm:grid-cols-2">
    {#each cards as card}
      {@const Icon = card.icon}
      <a
        href={card.href}
        class="group {card.color} rounded-[1.75rem] border-4 border-slate-900 p-6 text-slate-950 shadow-[7px_7px_0_#0f172a] transition-colors duration-200 hover:bg-white"
      >
        <Icon class="mb-4 h-7 w-7" />
        <h2 class="mb-2 text-lg font-black">
          {card.title}
        </h2>
        <p class="text-sm font-semibold leading-6 text-slate-700">
          {card.description}
        </p>
      </a>
    {/each}
  </div>

  <div class="mt-8 rounded-[1.75rem] border-4 border-slate-900 bg-white p-6 shadow-[8px_8px_0_#0f172a] dark:bg-slate-900">
    <div class="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-950 dark:text-slate-50">
      <Cloud class="h-4 w-4" />
      Domain setup pattern
    </div>
    <p class="text-sm font-semibold leading-7 text-slate-700 dark:text-slate-300">
      Keep the public landing/docs on Vercel, then point <code class="rounded-lg border-2 border-slate-900 bg-[#FFD166] px-1.5 py-0.5 text-slate-950">api</code>, <code class="rounded-lg border-2 border-slate-900 bg-[#FFD166] px-1.5 py-0.5 text-slate-950">inbox</code>, <code class="rounded-lg border-2 border-slate-900 bg-[#FFD166] px-1.5 py-0.5 text-slate-950">dashboard</code>, and <code class="rounded-lg border-2 border-slate-900 bg-[#FFD166] px-1.5 py-0.5 text-slate-950">mail</code> to the VPS.
    </p>
  </div>
</div>
