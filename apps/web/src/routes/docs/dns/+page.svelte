<svelte:head>
  <title>DNS and mail routing - mailuse</title>
</svelte:head>

<article class="container mx-auto max-w-3xl px-4 py-10">
  <a href="/docs" class="mb-6 inline-block text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">Back to docs</a>
  <h1 class="mb-3 text-3xl font-bold text-zinc-950 dark:text-zinc-50">DNS and mail routing</h1>
  <p class="mb-8 text-zinc-600 dark:text-zinc-400">
    Disposable email only works when inbound SMTP can reach your VPS. DNS can be prepared before install, but SMTP tests only pass after the Docker stack is running.
  </p>

  <div class="space-y-5">
    <section class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 class="mb-3 text-lg font-semibold">Required DNS records</h2>
      <pre class="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100"><code>A     @       VERCEL_TARGET       # public landing/docs if hosted on Vercel
A     docs    VERCEL_TARGET       # optional docs subdomain
A     api     YOUR_SERVER_IP      # API reverse proxy on VPS
A     inbox   YOUR_SERVER_IP      # self-hosted inbox web UI on VPS
A     mail    YOUR_SERVER_IP      # SMTP host on VPS, DNS only
MX    @       mail.yourdomain.com priority 10
TXT   @       v=spf1 a mx ~all</code></pre>
      <p class="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        If you use Cloudflare, keep <code class="rounded bg-zinc-100 px-1 py-0.5 dark:bg-zinc-800">mail</code> as DNS-only. Cloudflare proxy does not proxy SMTP port 25. For first install, keep <code class="rounded bg-zinc-100 px-1 py-0.5 dark:bg-zinc-800">api</code> and <code class="rounded bg-zinc-100 px-1 py-0.5 dark:bg-zinc-800">inbox</code> DNS-only until Traefik has issued certificates.
      </p>
    </section>

    <section class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 class="mb-3 text-lg font-semibold">1. Verify DNS only</h2>
      <p class="mb-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        These checks can pass before mailuse is installed on the VPS.
      </p>
      <pre class="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100"><code>dig MX yourdomain.com +short
dig A mail.yourdomain.com +short
dig A inbox.yourdomain.com +short
dig A api.yourdomain.com +short</code></pre>
    </section>

    <section class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 class="mb-3 text-lg font-semibold">2. Install mailuse on the VPS</h2>
      <p class="mb-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        Clone the repo, configure <code class="rounded bg-zinc-100 px-1 py-0.5 dark:bg-zinc-800">.env</code>, and start the Docker stack before testing port 25.
      </p>
      <pre class="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100"><code>curl -fsSL https://raw.githubusercontent.com/MrPinguiiin/mailuse/main/docker-compose.production.yml -o docker-compose.yml
DOMAIN=yourdomain.com docker compose up -d</code></pre>
    </section>

    <section class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 class="mb-3 text-lg font-semibold">3. Test SMTP after install</h2>
      <p class="mb-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        These commands will fail with connection refused until the SMTP container is running and port 25 is open.
      </p>
      <pre class="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100"><code>telnet mail.yourdomain.com 25
swaks --to test@yourdomain.com --from sender@example.com --server mail.yourdomain.com
docker compose -f docker-compose.production.yml logs -f smtp</code></pre>
    </section>
  </div>
</article>
