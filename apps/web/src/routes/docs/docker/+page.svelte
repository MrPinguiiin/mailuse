<svelte:head>
  <title>Docker deployment - mailuse</title>
</svelte:head>

<article class="container mx-auto max-w-3xl px-4 py-10">
  <a href="/docs" class="mb-6 inline-block text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">Back to docs</a>
  <h1 class="mb-3 text-3xl font-bold text-zinc-950 dark:text-zinc-50">Docker deployment</h1>
  <p class="mb-8 text-zinc-600 dark:text-zinc-400">Production stack: Traefik, web, API, SMTP receiver, Postgres, MinIO, and one-shot migration.</p>

  <section class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
    <h2 class="mb-3 text-lg font-semibold">Quick start</h2>
    <pre class="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100"><code>curl -fsSL https://raw.githubusercontent.com/MrPinguiiin/mailuse/main/docker-compose.production.yml -o docker-compose.yml
DOMAIN=yourdomain.com OWNER_PASSWORD='change-this-owner-password' LETSENCRYPT_EMAIL=admin@yourdomain.com docker compose up -d</code></pre>
  </section>

  <section class="mt-5 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
    <h2 class="mb-3 text-lg font-semibold">Important variables</h2>
    <pre class="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100"><code>DOMAIN=yourdomain.com
OWNER_PASSWORD=change-this-owner-password
LETSENCRYPT_EMAIL=admin@yourdomain.com
POSTGRES_PASSWORD=strong-postgres-password
MINIO_ROOT_PASSWORD=strong-minio-password
EMAIL_TTL_SECONDS=3600</code></pre>
  </section>

  <section class="mt-5 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
    <h2 class="mb-3 text-lg font-semibold">Services</h2>
    <ul class="list-disc space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
      <li>Traefik: public ports <code>80</code> and <code>443</code>, automatic HTTPS.</li>
      <li>Web: serves <code>inbox.DOMAIN</code> and <code>dashboard.DOMAIN</code>.</li>
      <li>API: internal port <code>3000</code>, public via <code>api.DOMAIN</code>.</li>
      <li>SMTP receiver: public port <code>25</code>, reached via <code>mail.DOMAIN</code>.</li>
      <li>Postgres and MinIO: internal storage services.</li>
    </ul>
  </section>

  <section class="mt-5 rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
    <h2 class="mb-3 text-lg font-semibold">Operational commands</h2>
    <pre class="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100"><code>docker compose ps
docker compose logs -f traefik
docker compose logs -f api
docker compose logs -f smtp
docker compose up -d --build
docker compose down
docker compose down -v  # deletes database and stored mail</code></pre>
  </section>
</article>
