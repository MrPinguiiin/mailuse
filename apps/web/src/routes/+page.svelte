<script lang="ts">
  import { ArrowRight, BookOpen, Code2, Container, Mail, Server, Shield, Zap } from "@lucide/svelte";
</script>

<svelte:head>
  <title>mailuse - Self-hosted disposable email</title>
  <meta
    name="description"
    content="mailuse is a self-hosted disposable email service with SMTP ingest, REST API, and SvelteKit dashboard."
  />
</svelte:head>

<div class="overflow-hidden">
  <section class="container mx-auto max-w-6xl px-4 py-16 sm:py-24">
    <div class="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
      <div>
        <div class="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          <Mail class="h-3.5 w-3.5" />
          Self-hosted disposable email
        </div>

        <h1 class="max-w-3xl text-5xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-6xl">
          Disposable inboxes you control.
        </h1>

        <p class="mt-5 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          mailuse gives you instant temporary email addresses with a built-in SMTP receiver,
          REST API, and clean web dashboard. Host the mail stack on your VPS, publish the
          web and docs anywhere.
        </p>

        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="/new"
            class="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Create inbox
            <ArrowRight class="h-4 w-4" />
          </a>
          <a
            href="/docs"
            class="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600"
          >
            Read docs
            <BookOpen class="h-4 w-4" />
          </a>
        </div>
      </div>

      <div class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-200/60 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/20">
        <div class="mb-4 flex items-center justify-between border-b border-zinc-200 pb-3 dark:border-zinc-800">
          <div class="flex items-center gap-2">
            <div class="h-2.5 w-2.5 rounded-full bg-emerald-500"></div>
            <span class="text-sm font-medium text-zinc-700 dark:text-zinc-300">mailuse stack</span>
          </div>
          <span class="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-500 dark:bg-zinc-800">VPS</span>
        </div>
        <div class="space-y-3">
          <div class="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <div class="mb-1 flex items-center gap-2 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              <Server class="h-4 w-4" /> SMTP ingest
            </div>
            <p class="text-sm text-zinc-500">Receive email on port 25 and parse MIME messages.</p>
          </div>
          <div class="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <div class="mb-1 flex items-center gap-2 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              <Code2 class="h-4 w-4" /> REST API
            </div>
            <p class="text-sm text-zinc-500">Create inboxes, list emails, read bodies, and delete data.</p>
          </div>
          <div class="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
            <div class="mb-1 flex items-center gap-2 text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              <Container class="h-4 w-4" /> Docker deploy
            </div>
            <p class="text-sm text-zinc-500">Postgres + MinIO + API + Web + SMTP in one compose stack.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="border-y border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50">
    <div class="container mx-auto grid max-w-6xl gap-4 px-4 py-8 sm:grid-cols-3">
      <div class="flex gap-3">
        <Zap class="mt-1 h-5 w-5 shrink-0 text-zinc-500" />
        <div>
          <h2 class="font-semibold text-zinc-950 dark:text-zinc-50">Instant inboxes</h2>
          <p class="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">Generate random or custom local-parts without signups.</p>
        </div>
      </div>
      <div class="flex gap-3">
        <Shield class="mt-1 h-5 w-5 shrink-0 text-zinc-500" />
        <div>
          <h2 class="font-semibold text-zinc-950 dark:text-zinc-50">Private by design</h2>
          <p class="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">No auth wall, no analytics requirement, and automatic expiry.</p>
        </div>
      </div>
      <div class="flex gap-3">
        <BookOpen class="mt-1 h-5 w-5 shrink-0 text-zinc-500" />
        <div>
          <h2 class="font-semibold text-zinc-950 dark:text-zinc-50">Operator docs</h2>
          <p class="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">VPS, Docker, DNS, API, and SMTP guides are included.</p>
        </div>
      </div>
    </div>
  </section>
</div>
