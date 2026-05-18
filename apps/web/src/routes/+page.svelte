<script lang="ts">
  import {
    ArrowRight,
    BookOpen,
    Code2,
    Container,
    Inbox,
    Mail,
    Server,
    Shield,
    TimerReset,
    Zap,
  } from "@lucide/svelte";

  const features = [
    {
      title: "No auth required",
      description: "Your users can generate disposable inboxes without sign-up forms, passwords, or friction.",
      icon: Zap,
    },
    {
      title: "Auto-expiring",
      description: "Configure TTL and let old inboxes and emails clean themselves up automatically.",
      icon: TimerReset,
    },
    {
      title: "Zero tracking",
      description: "Designed for privacy-first deployments. No analytics or account system required by default.",
      icon: Shield,
    },
    {
      title: "Built-in SMTP",
      description: "Run the receiver on your VPS and accept inbound email directly through port 25.",
      icon: Server,
    },
    {
      title: "Owner dashboard",
      description: "Monitor inboxes and emails, then generate an owner API token from a private dashboard.",
      icon: Code2,
    },
    {
      title: "Docker-ready",
      description: "Ship a complete stack with API, Web, SMTP, Postgres, and MinIO using Docker Compose.",
      icon: Container,
    },
  ];
</script>

<svelte:head>
  <title>mailuse - Self-hosted disposable email</title>
  <meta
    name="description"
    content="mailuse is a self-hosted disposable email service with SMTP ingest, REST API, and SvelteKit dashboard."
  />
</svelte:head>

<div class="overflow-hidden">
  <section class="relative border-b border-zinc-200 dark:border-zinc-800">
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(24,24,27,0.08),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(63,63,70,0.08),transparent_30%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.06),transparent_30%)]"></div>
    <div class="container mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:py-24 lg:grid-cols-[1.02fr_0.98fr]">
      <div>
        <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          v0.1.0 is building
        </div>

        <h1 class="max-w-3xl text-6xl font-black uppercase leading-[0.88] tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-7xl lg:text-8xl">
          Privacy is disposable.
        </h1>

        <p class="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          mailuse is an open-source disposable email kit for people who want to run the inbox service on their own VPS. Deploy the SMTP receiver, REST API, public inbox UI, and private owner dashboard under your own domain.
        </p>

        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="/docs"
            class="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            See docs
            <ArrowRight class="h-4 w-4" />
          </a>
          <a
            href="https://github.com/MrPinguiiin/mailuse"
            target="_blank"
            rel="noreferrer"
            class="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600"
          >
            GitHub
            <BookOpen class="h-4 w-4" />
          </a>
        </div>
      </div>

      <div class="rounded-3xl border border-zinc-200 bg-white p-4 shadow-2xl shadow-zinc-200/70 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/30">
        <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <p class="text-xs font-medium uppercase tracking-wide text-zinc-500">Disposable inbox</p>
              <p class="mt-1 font-mono text-sm font-semibold text-zinc-950 dark:text-zinc-50">test@yourdomain.com</p>
            </div>
            <span class="rounded-full bg-zinc-950 px-3 py-1 text-xs text-white dark:bg-zinc-50 dark:text-zinc-950">Self-hosted</span>
          </div>

          <div class="space-y-3">
            <div class="rounded-xl bg-white p-4 shadow-sm dark:bg-zinc-950">
              <div class="mb-2 flex items-center justify-between text-xs text-zinc-500">
                <span>FROM: Verification Bot</span>
                <span>12:04 PM</span>
              </div>
              <p class="text-sm text-zinc-800 dark:text-zinc-200">Your temporary verification code is:</p>
              <p class="mt-2 font-mono text-2xl font-bold tracking-widest text-zinc-950 dark:text-zinc-50">892-113</p>
            </div>
            <div class="rounded-xl bg-white p-4 shadow-sm dark:bg-zinc-950">
              <div class="mb-2 flex items-center justify-between text-xs text-zinc-500">
                <span>FROM: Newsletter</span>
                <span>11:58 AM</span>
              </div>
              <p class="text-sm text-zinc-800 dark:text-zinc-200">Welcome to the weekly digest...</p>
            </div>
          </div>

          <div class="mt-4 rounded-xl border border-zinc-200 bg-white p-3 text-center text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            Inbox expires in 59:59
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="border-b border-zinc-200 bg-zinc-950 py-3 text-zinc-50 dark:border-zinc-800">
    <div class="container mx-auto flex max-w-6xl flex-wrap justify-center gap-x-6 gap-y-2 px-4 text-xs font-semibold uppercase tracking-widest text-zinc-300">
      <span>Open source</span>
      <span>MIT license</span>
      <span>Docker ready</span>
      <span>No tracking</span>
      <span>Self hosted</span>
      <span>Owner dashboard</span>
    </div>
  </div>

  <section id="features" class="container mx-auto max-w-6xl px-4 py-16 sm:py-20">
    <div class="mb-10">
      <p class="mb-2 text-sm font-semibold uppercase tracking-widest text-zinc-500">Batteries included</p>
      <h2 class="text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Everything an operator needs.</h2>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each features as feature}
        {@const Icon = feature.icon}
        <div class="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <Icon class="mb-4 h-5 w-5 text-zinc-500" />
          <h3 class="mb-2 font-semibold text-zinc-950 dark:text-zinc-50">{feature.title}</h3>
          <p class="text-sm leading-6 text-zinc-600 dark:text-zinc-400">{feature.description}</p>
        </div>
      {/each}
    </div>
  </section>

  <section class="border-y border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50">
    <div class="container mx-auto grid max-w-6xl gap-8 px-4 py-16 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <p class="mb-2 text-sm font-semibold uppercase tracking-widest text-zinc-500">Ready to deploy?</p>
        <h2 class="text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Install it on your VPS.</h2>
        <p class="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          The public website only hosts documentation. The actual inbox service runs on your server so SMTP, data, owner dashboard, and storage stay under your control.
        </p>
      </div>

      <div class="rounded-2xl border border-zinc-200 bg-zinc-950 p-5 text-zinc-100 dark:border-zinc-800">
        <div class="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">
          <Container class="h-4 w-4" /> Docker quick start
        </div>
        <pre class="overflow-x-auto text-sm leading-7"><code>mkdir -p ~/mailuse-install
cd ~/mailuse-install
curl -fsSL https://raw.githubusercontent.com/MrPinguiiin/mailuse/main/docker-compose.production.yml -o docker-compose.yml
DOMAIN=yourdomain.com OWNER_PASSWORD='change-this-owner-password' LETSENCRYPT_EMAIL=admin@yourdomain.com docker compose up -d</code></pre>
      </div>
    </div>
  </section>

  <footer class="container mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
    <div class="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
      <Inbox class="h-4 w-4" /> mailuse
    </div>
    <div class="flex gap-4">
      <a href="/docs" class="hover:text-zinc-900 dark:hover:text-zinc-100">Documentation</a>
      <a href="https://github.com/MrPinguiiin/mailuse" target="_blank" rel="noreferrer" class="hover:text-zinc-900 dark:hover:text-zinc-100">GitHub</a>
    </div>
  </footer>
</div>
