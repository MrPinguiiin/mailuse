<script lang="ts">
  import {
    ArrowRight,
    BookOpen,
    CheckCircle2,
    Clock3,
    Code2,
    Container,
    Inbox,
    KeyRound,
    Mail,
    MessageSquareHeart,
    Rocket,
    Server,
    Shield,
    Sparkles,
    TimerReset,
    Zap,
  } from "@lucide/svelte";

  const catalog = [
    {
      title: "Verification playground",
      description: "Catch OTPs, magic links, and QA emails without creating real user accounts.",
      icon: KeyRound,
      color: "bg-[#FFD166]",
    },
    {
      title: "Campaign sandbox",
      description: "Preview newsletters and product emails in throwaway inboxes before they touch customers.",
      icon: Mail,
      color: "bg-[#8AE9C1]",
    },
    {
      title: "API lab",
      description: "Create inboxes, read messages, and automate test flows with a simple REST API.",
      icon: Code2,
      color: "bg-[#A5B4FC]",
    },
  ];

  const progressSteps = [
    { label: "SMTP receiver online", value: "100%", width: "w-full", color: "bg-[#22C55E]" },
    { label: "Inbox TTL cleanup", value: "82%", width: "w-10/12", color: "bg-[#F97316]" },
    { label: "Owner dashboard setup", value: "64%", width: "w-8/12", color: "bg-[#6366F1]" },
  ];

  const features = [
    { title: "No auth maze", description: "Visitors can create disposable inboxes without sign-up friction.", icon: Zap },
    { title: "Auto-expiring mail", description: "Configure TTLs so stale inboxes and messages clean themselves up.", icon: TimerReset },
    { title: "Self-hosted stack", description: "Run Web, API, SMTP, Postgres, and MinIO under your own domain.", icon: Server },
    { title: "Privacy-first defaults", description: "No tracking layer, no external inbox dependency, and operator-owned data.", icon: Shield },
  ];

  const testimonials = [
    {
      quote: "mailuse made our auth testing feel like a tiny lab instead of a spreadsheet of disposable accounts.",
      name: "Nadia",
      role: "QA Lead",
    },
    {
      quote: "The VPS setup keeps email data close, while the public inbox UI stays simple enough for the whole team.",
      name: "Rafi",
      role: "Indie SaaS builder",
    },
    {
      quote: "We use it like a training ground for onboarding developers into email flows and webhook tests.",
      name: "Mika",
      role: "Platform Engineer",
    },
  ];
</script>

<svelte:head>
  <title>mailuse - Playful self-hosted disposable email</title>
  <meta
    name="description"
    content="mailuse is a self-hosted disposable email service with SMTP ingest, REST API, public inbox UI, and private owner dashboard."
  />
</svelte:head>

<div class="overflow-hidden bg-[#FFF7E8] text-slate-950 dark:bg-slate-950 dark:text-slate-50">
  <section class="relative isolate">
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(251,113,133,0.35),transparent_26%),radial-gradient(circle_at_82%_10%,rgba(34,197,94,0.28),transparent_26%),radial-gradient(circle_at_50%_82%,rgba(99,102,241,0.22),transparent_30%)]"></div>
    <div class="container mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:py-24 lg:grid-cols-[1fr_0.92fr]">
      <div>
        <div class="mb-6 inline-flex items-center gap-2 rounded-full border-4 border-slate-900 bg-white px-4 py-2 text-xs font-black uppercase tracking-widest shadow-[6px_6px_0_#0f172a] dark:bg-slate-900 dark:shadow-[6px_6px_0_#f8fafc]">
          <Sparkles class="h-4 w-4 text-[#F97316]" /> Self-hosted inbox lab
        </div>

        <h1 class="max-w-4xl text-5xl font-black leading-[0.94] tracking-tight sm:text-7xl lg:text-8xl">
          Make disposable email feel playful, private, and yours.
        </h1>

        <p class="mt-6 max-w-2xl text-lg font-medium leading-8 text-slate-700 dark:text-slate-300">
          mailuse turns temporary inboxes into a friendly testing playground for teams. Catch verification codes, preview email flows, and run the full SMTP stack on your own VPS.
        </p>

        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="/docs"
            class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 bg-[#22C55E] px-6 py-4 text-sm font-black text-slate-950 shadow-[6px_6px_0_#0f172a] transition-colors duration-200 hover:bg-[#86EFAC] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#6366F1]"
          >
            Start with docs
            <ArrowRight class="h-4 w-4" />
          </a>
          <a
            href="https://github.com/MrPinguiiin/mailuse"
            target="_blank"
            rel="noreferrer"
            class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 bg-white px-6 py-4 text-sm font-black text-slate-950 shadow-[6px_6px_0_#0f172a] transition-colors duration-200 hover:bg-[#FFD166] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#6366F1]"
          >
            View GitHub
            <BookOpen class="h-4 w-4" />
          </a>
        </div>
      </div>

      <div class="rounded-[2rem] border-4 border-slate-900 bg-[#A5B4FC] p-4 shadow-[12px_12px_0_#0f172a]">
        <div class="rounded-[1.5rem] border-4 border-slate-900 bg-white p-4 shadow-[inset_-5px_-5px_0_rgba(15,23,42,0.08)]">
          <div class="mb-4 flex items-center justify-between gap-4">
            <div>
              <p class="text-xs font-black uppercase tracking-widest text-slate-500">Live inbox demo</p>
              <p class="mt-1 font-mono text-sm font-black text-slate-950">demo@yourdomain.com</p>
            </div>
            <span class="rounded-full border-2 border-slate-900 bg-[#8AE9C1] px-3 py-1 text-xs font-black text-slate-950">59:59 TTL</span>
          </div>

          <div class="space-y-3">
            <div class="rounded-3xl border-4 border-slate-900 bg-[#FFF7E8] p-4 shadow-[5px_5px_0_#0f172a]">
              <div class="mb-3 flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Verification Bot</span>
                <span>12:04 PM</span>
              </div>
              <p class="text-sm font-semibold text-slate-700">Your temporary verification code is:</p>
              <p class="mt-2 font-mono text-3xl font-black tracking-widest text-slate-950">892-113</p>
            </div>
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="rounded-3xl border-4 border-slate-900 bg-[#FFD166] p-4 shadow-[5px_5px_0_#0f172a]">
                <Clock3 class="mb-3 h-5 w-5" />
                <p class="text-sm font-black">Auto cleanup</p>
                <p class="mt-1 text-xs font-semibold text-slate-700">Old inboxes expire without manual chores.</p>
              </div>
              <div class="rounded-3xl border-4 border-slate-900 bg-[#8AE9C1] p-4 shadow-[5px_5px_0_#0f172a]">
                <Shield class="mb-3 h-5 w-5" />
                <p class="text-sm font-black">Owned data</p>
                <p class="mt-1 text-xs font-semibold text-slate-700">SMTP and storage stay on your server.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div class="border-y-4 border-slate-900 bg-slate-950 py-4 text-slate-50">
    <div class="container mx-auto flex max-w-6xl flex-wrap justify-center gap-x-8 gap-y-2 px-4 text-xs font-black uppercase tracking-widest">
      <span>Open source</span><span>Docker ready</span><span>SMTP ingest</span><span>No tracking</span><span>Owner dashboard</span>
    </div>
  </div>

  <section id="features" class="container mx-auto max-w-6xl px-4 py-16 sm:py-20">
    <div class="mb-10 max-w-2xl">
      <p class="mb-2 text-sm font-black uppercase tracking-widest text-[#F97316]">Course catalog preview</p>
      <h2 class="text-4xl font-black tracking-tight sm:text-5xl">Pick an inbox adventure.</h2>
      <p class="mt-4 font-medium leading-7 text-slate-700 dark:text-slate-300">A playful catalog-style overview for the real mailuse workflows your team can run every day.</p>
    </div>

    <div class="grid gap-5 md:grid-cols-3">
      {#each catalog as item}
        {@const Icon = item.icon}
        <article class="rounded-[1.75rem] border-4 border-slate-900 {item.color} p-6 shadow-[8px_8px_0_#0f172a] transition-colors duration-200 hover:bg-white">
          <Icon class="mb-5 h-8 w-8" />
          <h3 class="text-xl font-black">{item.title}</h3>
          <p class="mt-3 text-sm font-semibold leading-6 text-slate-700">{item.description}</p>
        </article>
      {/each}
    </div>
  </section>

  <section class="border-y-4 border-slate-900 bg-white dark:bg-slate-900">
    <div class="container mx-auto grid max-w-6xl gap-8 px-4 py-16 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <p class="mb-2 text-sm font-black uppercase tracking-widest text-[#6366F1]">Progress tracking demo</p>
        <h2 class="text-4xl font-black tracking-tight sm:text-5xl">See your mail stack level up.</h2>
        <p class="mt-4 font-medium leading-7 text-slate-700 dark:text-slate-300">Use the owner dashboard to understand inbox activity, service health, and cleanup progress without turning operations into homework.</p>
      </div>

      <div class="rounded-[2rem] border-4 border-slate-900 bg-[#FFF7E8] p-5 shadow-[10px_10px_0_#0f172a]">
        <div class="mb-5 flex items-center justify-between rounded-2xl border-4 border-slate-900 bg-[#FDE68A] p-4">
          <div>
            <p class="text-xs font-black uppercase tracking-widest text-slate-600">Operator score</p>
            <p class="text-3xl font-black">Level 4</p>
          </div>
          <Rocket class="h-10 w-10 text-[#F97316]" />
        </div>
        <div class="space-y-4">
          {#each progressSteps as step}
            <div>
              <div class="mb-2 flex items-center justify-between text-sm font-black">
                <span>{step.label}</span>
                <span>{step.value}</span>
              </div>
              <div class="h-5 rounded-full border-4 border-slate-900 bg-white p-0.5">
                <div class="h-full rounded-full {step.width} {step.color}"></div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <section class="container mx-auto max-w-6xl px-4 py-16 sm:py-20">
    <div class="mb-10 max-w-2xl">
      <p class="mb-2 text-sm font-black uppercase tracking-widest text-[#22C55E]">Clay cards, real features</p>
      <h2 class="text-4xl font-black tracking-tight sm:text-5xl">Friendly on the surface. Serious underneath.</h2>
    </div>
    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {#each features as feature}
        {@const Icon = feature.icon}
        <div class="rounded-[1.75rem] border-4 border-slate-900 bg-white p-5 shadow-[7px_7px_0_#0f172a] dark:bg-slate-900">
          <Icon class="mb-4 h-6 w-6 text-[#6366F1]" />
          <h3 class="font-black">{feature.title}</h3>
          <p class="mt-2 text-sm font-medium leading-6 text-slate-700 dark:text-slate-300">{feature.description}</p>
        </div>
      {/each}
    </div>
  </section>

  <section class="border-y-4 border-slate-900 bg-[#A5B4FC]">
    <div class="container mx-auto max-w-6xl px-4 py-16">
      <div class="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p class="mb-2 text-sm font-black uppercase tracking-widest text-slate-800">Student testimonials</p>
          <h2 class="text-4xl font-black tracking-tight sm:text-5xl">Teams learn faster with throwaway inboxes.</h2>
        </div>
        <MessageSquareHeart class="hidden h-12 w-12 sm:block" />
      </div>
      <div class="grid gap-5 md:grid-cols-3">
        {#each testimonials as testimonial}
          <figure class="rounded-[1.75rem] border-4 border-slate-900 bg-white p-6 shadow-[8px_8px_0_#0f172a]">
            <blockquote class="text-sm font-bold leading-7 text-slate-800">"{testimonial.quote}"</blockquote>
            <figcaption class="mt-5 border-t-4 border-slate-900 pt-4">
              <p class="font-black">{testimonial.name}</p>
              <p class="text-sm font-semibold text-slate-600">{testimonial.role}</p>
            </figcaption>
          </figure>
        {/each}
      </div>
    </div>
  </section>

  <section class="bg-[#FFF7E8] py-4 dark:bg-slate-950">
    <div class="container mx-auto grid max-w-6xl items-stretch gap-8 px-4 py-16 xl:grid-cols-[0.95fr_1.05fr]">
      <div class="relative overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-white p-6 shadow-[10px_10px_0_#0f172a] dark:bg-slate-900 sm:p-8">
        <div class="absolute -right-10 -top-10 h-28 w-28 rounded-full border-4 border-slate-900 bg-[#FFD166]"></div>
        <div class="absolute -bottom-12 right-16 h-24 w-24 rounded-full border-4 border-slate-900 bg-[#A5B4FC]"></div>

        <div class="relative">
          <div class="mb-6 flex flex-wrap items-center gap-3">
            <p class="inline-flex rounded-full border-2 border-slate-900 bg-[#FFE8A3] px-3 py-1 text-xs font-black uppercase tracking-widest text-slate-950">
              Ready to deploy?
            </p>
            <span class="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-[#8AE9C1] px-3 py-1 text-xs font-black text-slate-950">
              <Server class="h-3.5 w-3.5" /> VPS required
            </span>
          </div>

          <h2 class="max-w-2xl text-4xl font-black leading-[0.96] tracking-tight sm:text-5xl">Install it on your VPS.</h2>
          <p class="mt-5 max-w-2xl text-base font-semibold leading-7 text-slate-700 dark:text-slate-300">
            The public website only hosts documentation. The actual inbox service runs on your server, so SMTP, data, owner dashboard, and storage stay under your control.
          </p>

          <div class="mt-6 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div class="rounded-2xl border-2 border-slate-900 bg-[#FFF7E8] p-3 text-sm font-black text-slate-950">
              SMTP stays yours
            </div>
            <div class="rounded-2xl border-2 border-slate-900 bg-[#FFF7E8] p-3 text-sm font-black text-slate-950">
              Dashboard private
            </div>
            <div class="rounded-2xl border-2 border-slate-900 bg-[#FFF7E8] p-3 text-sm font-black text-slate-950">
              Storage controlled
            </div>
          </div>

          <div class="mt-6 rounded-3xl border-4 border-slate-900 bg-[#8AE9C1] p-4 text-slate-950 shadow-[6px_6px_0_#0f172a]">
            <div class="flex items-start gap-3">
              <span class="shrink-0 rounded-2xl border-2 border-slate-900 bg-white p-2">
                <CheckCircle2 class="h-5 w-5" />
              </span>
              <div>
                <p class="font-black">Keep secrets persisted during updates.</p>
                <p class="mt-1 text-sm font-semibold leading-6 text-slate-700">
                  Pass the same passwords and domain values when recreating the Docker stack.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="min-w-0 rounded-[2rem] border-4 border-slate-900 bg-slate-950 p-5 text-slate-100 shadow-[10px_10px_0_#6366f1] sm:p-6">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3 border-b-4 border-slate-700 pb-4">
          <div class="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#8AE9C1]">
            <Container class="h-4 w-4" /> Docker quick start
          </div>
          <span class="rounded-full border-2 border-[#8AE9C1] px-3 py-1 text-xs font-black text-[#8AE9C1]">copy-ready</span>
        </div>
        <pre class="max-w-full overflow-x-auto whitespace-pre-wrap break-words text-sm leading-7"><code>mkdir -p ~/mailuse-install
cd ~/mailuse-install
curl -fsSL https://raw.githubusercontent.com/MrPinguiiin/mailuse/main/docker-compose.production.yml -o docker-compose.yml
DOMAIN=yourdomain.com OWNER_PASSWORD='change-this-owner-password' LETSENCRYPT_EMAIL=admin@yourdomain.com docker compose up -d</code></pre>
      </div>
    </div>
  </section>

  <section class="border-y-4 border-slate-900 bg-[#22C55E]">
    <div class="container mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-12 sm:flex-row sm:items-center">
      <div>
        <p class="text-sm font-black uppercase tracking-widest text-slate-800">Enrollment CTA</p>
        <h2 class="mt-2 text-4xl font-black tracking-tight">Enroll your team in cleaner email testing.</h2>
      </div>
      <a href="/docs" class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 bg-white px-6 py-4 text-sm font-black text-slate-950 shadow-[6px_6px_0_#0f172a] transition-colors duration-200 hover:bg-[#FFD166] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-white">
        Read deployment guide
        <ArrowRight class="h-4 w-4" />
      </a>
    </div>
  </section>

  <footer class="container mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm font-semibold text-slate-600 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
    <div class="flex items-center gap-2 font-black text-slate-950 dark:text-slate-100">
      <Inbox class="h-4 w-4" /> mailuse
    </div>
    <div class="flex gap-4">
      <a href="/docs" class="transition-colors hover:text-slate-950 dark:hover:text-slate-100">Documentation</a>
      <a href="https://github.com/MrPinguiiin/mailuse" target="_blank" rel="noreferrer" class="transition-colors hover:text-slate-950 dark:hover:text-slate-100">GitHub</a>
    </div>
  </footer>
</div>
