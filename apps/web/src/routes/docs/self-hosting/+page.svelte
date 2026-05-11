<svelte:head>
  <title>Self-hosting mailuse</title>
</svelte:head>

<article class="container mx-auto max-w-3xl px-4 py-10">
  <a href="/docs" class="mb-6 inline-block text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">Back to docs</a>
  <h1 class="mb-3 text-3xl font-bold text-zinc-950 dark:text-zinc-50">Self-hosting on a VPS</h1>
  <p class="mb-8 text-zinc-600 dark:text-zinc-400">
    mailuse runs as three app services plus storage: web, api, smtp, Postgres, and MinIO.
    The production compose file also runs a one-shot migration service to prepare the database schema.
  </p>

  <section class="space-y-6">
    <div class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 class="mb-3 text-lg font-semibold">1. Server requirements</h2>
      <ul class="list-disc space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
        <li>Ubuntu/Debian VPS with public IPv4</li>
        <li>Docker 20.10+ and Docker Compose 2+</li>
        <li>Ports 25, 80, and 443 open</li>
        <li>A domain where you can edit DNS records</li>
      </ul>
    </div>

    <div class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 class="mb-3 text-lg font-semibold">2. Start services</h2>
      <pre class="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100"><code>curl -fsSL https://raw.githubusercontent.com/MrPinguiiin/mailuse/main/docker-compose.production.yml -o docker-compose.yml
DOMAIN=yourdomain.com docker compose up -d</code></pre>
    </div>

    <div class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 class="mb-3 text-lg font-semibold">3. Configure environment</h2>
      <pre class="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100"><code>DOMAIN=yourdomain.com
APP_NAME=mailuse
EMAIL_TTL_SECONDS=3600
CORS_ORIGIN=https://yourdomain.com
PUBLIC_API_URL=https://api.yourdomain.com</code></pre>
    </div>

    <div class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 class="mb-3 text-lg font-semibold">4. Verify</h2>
      <pre class="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100"><code>docker compose logs -f smtp
curl https://api.yourdomain.com/api/health</code></pre>
    </div>
  </section>
</article>
