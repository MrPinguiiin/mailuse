<svelte:head>
  <title>mailuse API reference</title>
</svelte:head>

<article class="container mx-auto max-w-3xl px-4 py-10">
  <a href="/docs" class="mb-6 inline-block text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">Back to docs</a>
  <h1 class="mb-3 text-3xl font-bold text-zinc-950 dark:text-zinc-50">API reference</h1>
  <p class="mb-8 text-zinc-600 dark:text-zinc-400">Public inbox endpoints power the disposable inbox UI. Owner endpoints require the token from <code>dashboard.yourdomain.com</code>.</p>

  <div class="space-y-5">
    <section class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 class="mb-3 text-lg font-semibold">Public inbox lifecycle</h2>
      <pre class="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100"><code>POST   /api/v1/inboxes
GET    /api/v1/inboxes/:address
DELETE /api/v1/inboxes/:address</code></pre>
    </section>

    <section class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 class="mb-3 text-lg font-semibold">Public email lifecycle</h2>
      <pre class="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100"><code>GET    /api/v1/inboxes/:address/emails
GET    /api/v1/inboxes/:address/emails/:emailId
DELETE /api/v1/inboxes/:address/emails/:emailId</code></pre>
    </section>

    <section class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 class="mb-3 text-lg font-semibold">Owner-only endpoints</h2>
      <pre class="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100"><code>POST /api/v1/owner/login
GET  /api/v1/owner/me
GET  /api/v1/owner/stats
GET  /api/v1/owner/inboxes
GET  /api/v1/owner/api</code></pre>
      <p class="mt-3 text-sm text-zinc-600 dark:text-zinc-400">Owner endpoints require <code>Authorization: Bearer OWNER_TOKEN</code>. Generate/copy the token from the owner dashboard.</p>
    </section>

    <section class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 class="mb-3 text-lg font-semibold">Owner token example</h2>
      <pre class="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100"><code>curl https://api.yourdomain.com/api/v1/owner/stats \
  -H "Authorization: Bearer YOUR_OWNER_TOKEN"</code></pre>
    </section>

    <section class="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 class="mb-3 text-lg font-semibold">Legacy-compatible endpoints</h2>
      <pre class="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100"><code>GET    /api/inbox/:address
DELETE /api/inbox/:address
GET    /api/email/:id
DELETE /api/email/:id
GET    /api/health</code></pre>
    </section>
  </div>
</article>
