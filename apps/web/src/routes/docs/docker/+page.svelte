<svelte:head>
  <title>Docker deployment - mailuse</title>
</svelte:head>

<article class="container mx-auto max-w-3xl px-4 py-10">
  <a href="/docs" class="mb-6 inline-block text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">Back to docs</a>
  <h1 class="mb-3 text-3xl font-bold text-zinc-950 dark:text-zinc-50">Docker deployment</h1>
  <p class="mb-8 text-zinc-600 dark:text-zinc-400">
    Production stack: web, api, smtp, Postgres, and MinIO.
  </p>

  <section class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
    <h2 class="mb-3 text-lg font-semibold">Run production compose</h2>
    <pre class="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100"><code>cd infra/docker
cp .env.example .env
docker compose -f docker-compose.production.yml up -d</code></pre>
  </section>

  <section class="mt-5 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
    <h2 class="mb-3 text-lg font-semibold">Services</h2>
    <ul class="list-disc space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
      <li>Web UI: port 5173</li>
      <li>REST API: port 3000</li>
      <li>SMTP receiver: port 25</li>
      <li>MinIO console: port 9001</li>
    </ul>
  </section>
</article>
