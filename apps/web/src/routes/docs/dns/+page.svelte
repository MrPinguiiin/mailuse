<svelte:head>
  <title>DNS and mail routing - mailuse</title>
</svelte:head>

<article class="container mx-auto max-w-3xl px-4 py-10">
  <a href="/docs" class="mb-6 inline-block text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">Back to docs</a>
  <h1 class="mb-3 text-3xl font-bold text-zinc-950 dark:text-zinc-50">DNS and mail routing</h1>
  <p class="mb-8 text-zinc-600 dark:text-zinc-400">mailuse uses separate subdomains for the public app, owner dashboard, API, and SMTP receiver.</p>

  <div class="space-y-5">
    <section class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 class="mb-3 text-lg font-semibold">Required records</h2>
      <pre class="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100"><code>A     @          VERCEL_TARGET   # optional public landing/docs on Vercel
A     api        YOUR_SERVER_IP  # REST API through Traefik
A     inbox      YOUR_SERVER_IP  # public disposable inbox UI
A     dashboard  YOUR_SERVER_IP  # private owner dashboard
A     mail       YOUR_SERVER_IP  # SMTP host, DNS only
MX    @          mail.yourdomain.com priority 10
TXT   @          v=spf1 a mx ~all</code></pre>
      <p class="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">Cloudflare proxy does not proxy SMTP port 25, so <code>mail</code> must always be DNS-only. Keep <code>api</code>, <code>inbox</code>, and <code>dashboard</code> DNS-only during the first install so Traefik can issue certificates cleanly.</p>
    </section>

    <section class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 class="mb-3 text-lg font-semibold">Verify DNS</h2>
      <pre class="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100"><code>dig A api.yourdomain.com +short
dig A inbox.yourdomain.com +short
dig A dashboard.yourdomain.com +short
dig A mail.yourdomain.com +short
dig MX yourdomain.com +short</code></pre>
      <p class="mt-3 text-sm text-zinc-600 dark:text-zinc-400">All A records should return your VPS IP. If you see Cloudflare IPs, the record is still proxied.</p>
    </section>

    <section class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 class="mb-3 text-lg font-semibold">Subdomain roles</h2>
      <ul class="list-disc space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
        <li><code>inbox.yourdomain.com</code>: public disposable email UI.</li>
        <li><code>dashboard.yourdomain.com</code>: owner-only monitoring and API token dashboard.</li>
        <li><code>api.yourdomain.com</code>: REST API endpoint.</li>
        <li><code>mail.yourdomain.com</code>: SMTP receiver used by MX records.</li>
      </ul>
    </section>

    <section class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 class="mb-3 text-lg font-semibold">SMTP test</h2>
      <pre class="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100"><code>telnet mail.yourdomain.com 25
swaks --to test@yourdomain.com --from sender@example.com --server mail.yourdomain.com</code></pre>
    </section>
  </div>
</article>
