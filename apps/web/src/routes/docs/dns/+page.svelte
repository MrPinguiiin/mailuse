<svelte:head>
  <title>DNS and mail routing - mailuse</title>
</svelte:head>

<article class="container mx-auto max-w-3xl px-4 py-10">
  <a href="/docs" class="mb-6 inline-block text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">Back to docs</a>
  <h1 class="mb-3 text-3xl font-bold text-zinc-950 dark:text-zinc-50">DNS and mail routing</h1>
  <p class="mb-8 text-zinc-600 dark:text-zinc-400">
    Disposable email only works when inbound SMTP can reach your VPS.
  </p>

  <div class="space-y-5">
    <section class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 class="mb-3 text-lg font-semibold">Required DNS records</h2>
      <pre class="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100"><code>A    @       YOUR_SERVER_IP
A    api     YOUR_SERVER_IP
A    docs    VERCEL_TARGET
MX   @       yourdomain.com  priority 10
TXT  @       v=spf1 a mx ~all</code></pre>
    </section>

    <section class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 class="mb-3 text-lg font-semibold">Test SMTP</h2>
      <pre class="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100"><code>dig MX yourdomain.com +short
telnet yourdomain.com 25
swaks --to test@yourdomain.com --from sender@example.com --server yourdomain.com</code></pre>
    </section>
  </div>
</article>
