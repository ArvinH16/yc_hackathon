export default function Home() {
  const links = [
    { href: '/dashboard/customer/map', title: 'Customer — Map', desc: 'Competitor map with 50-mile radius' },
    { href: '/dashboard/customer/analytics', title: 'Customer — Analytics', desc: 'Pricing intelligence and opportunities' },
    { href: '/dashboard/customer/monitoring', title: 'Customer — Monitoring', desc: 'Trends and alerts' },
    { href: '/dashboard/crm/leads', title: 'CRM — Leads', desc: 'Lead list and outreach status' },
  ];

  return (
    <div className="mx-auto max-w-5xl p-8 space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Beam Bell Competitive Intelligence</h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-300">Navigate to key dashboards using the links below.</p>
      </header>

      <main className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="rounded-md border p-4 transition hover:bg-zinc-50 dark:hover:bg-zinc-900/40"
          >
            <div className="text-lg font-medium">{l.title}</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-300">{l.desc}</div>
            <div className="mt-2 text-sm text-blue-600">Open →</div>
          </a>
        ))}
      </main>
    </div>
  );
}
