<svelte:head>
  <title>Self-hosting mailuse</title>
</svelte:head>

<article class="container mx-auto max-w-3xl px-4 py-10">
  <a href="/docs" class="mb-6 inline-block text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">Back to docs</a>
  <h1 class="mb-3 text-3xl font-bold text-zinc-950 dark:text-zinc-50">Self-hosting on a VPS</h1>
  <p class="mb-8 text-zinc-600 dark:text-zinc-400">
    The Vercel site is only the public landing/docs. The real mail service runs on your VPS with Traefik, API, inbox UI, owner dashboard, SMTP, Postgres, and MinIO.
  </p>

  <section class="space-y-6">
    <div class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 class="mb-3 text-lg font-semibold">1. Prepare the server</h2>
      <ul class="list-disc space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
        <li>Ubuntu/Debian VPS with public IPv4.</li>
        <li>Docker and Docker Compose v2 installed.</li>
        <li>Firewall allows ports <code>25</code>, <code>80</code>, and <code>443</code>.</li>
        <li>Cloud provider does not block outbound/inbound SMTP port <code>25</code>.</li>
        <li>A domain where you can edit DNS records.</li>
      </ul>
    </div>

    <div class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 class="mb-3 text-lg font-semibold">2. Prepare DNS</h2>
      <pre class="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100"><code>A     api        YOUR_SERVER_IP  # DNS only
A     inbox      YOUR_SERVER_IP  # DNS only
A     dashboard  YOUR_SERVER_IP  # DNS only
A     mail       YOUR_SERVER_IP  # DNS only, required for SMTP
MX    @          mail.yourdomain.com priority 10
TXT   @          v=spf1 a mx ~all</code></pre>
      <p class="mt-3 text-sm text-zinc-600 dark:text-zinc-400">Keep <code>mail</code> DNS-only permanently. During first install, keep <code>api</code>, <code>inbox</code>, and <code>dashboard</code> DNS-only until Traefik issues certificates.</p>
    </div>

    <div class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 class="mb-3 text-lg font-semibold">3. Install</h2>
      <pre class="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100"><code>mkdir -p ~/mailuse-install
cd ~/mailuse-install
curl -fsSL https://raw.githubusercontent.com/MrPinguiiin/mailuse/main/docker-compose.production.yml -o docker-compose.yml
DOMAIN=yourdomain.com OWNER_PASSWORD='change-this-owner-password' LETSENCRYPT_EMAIL=admin@yourdomain.com docker compose up -d</code></pre>
      <p class="mt-3 text-sm text-zinc-600 dark:text-zinc-400"><code>OWNER_PASSWORD</code> enables the private owner dashboard at <code>dashboard.yourdomain.com</code>. Use at least 8 characters.</p>
    </div>

    <div class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 class="mb-3 text-lg font-semibold">4. Verify services</h2>
      <pre class="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100"><code>docker compose ps
curl https://api.yourdomain.com/api/health
open https://inbox.yourdomain.com
open https://dashboard.yourdomain.com
telnet mail.yourdomain.com 25</code></pre>
    </div>

    <div class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 class="mb-3 text-lg font-semibold">5. Test inbound mail</h2>
      <pre class="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100"><code>swaks --to test@yourdomain.com --from sender@example.com --server mail.yourdomain.com
curl "https://api.yourdomain.com/api/inbox/test@yourdomain.com"</code></pre>
    </div>

    <div class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 class="mb-3 text-lg font-semibold">6. Debug checklist</h2>
      <pre class="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100"><code>docker compose logs -f traefik
docker compose logs -f api
docker compose logs -f smtp
dig A api.yourdomain.com +short
dig A inbox.yourdomain.com +short
dig A dashboard.yourdomain.com +short
dig MX yourdomain.com +short</code></pre>
      <ul class="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
        <li>If HTTPS fails, check ports <code>80</code>/<code>443</code> and Traefik logs.</li>
        <li>If SMTP fails, check port <code>25</code>, MX record, and SMTP logs.</li>
        <li>If dashboard login fails repeatedly, wait for the rate-limit window or restart API.</li>
      </ul>
    </div>

    <div class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 class="mb-3 text-lg font-semibold">7. Owner updates</h2>
      <p class="mb-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        The owner dashboard checks GitHub Releases, not commit hashes. When a new release exists, open <code>dashboard.yourdomain.com/dashboard/updates</code> and trigger the update manually.
      </p>
      <ul class="list-disc space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
        <li>Updates are owner-only and require the dashboard token.</li>
        <li>Only one update can run at a time.</li>
        <li>Update attempts are audited in <code>dashboard.yourdomain.com/dashboard/history</code>.</li>
        <li>Database backups are kept for <code>3</code> days by default.</li>
      </ul>
    </div>
  </section>
</article>
