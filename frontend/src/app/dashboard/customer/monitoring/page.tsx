"use client";

import { mockTrends } from '@/data/mock/mockTrends';

export default function CustomerMonitoringPage() {
  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Market Monitoring</h1>

      <section className="space-y-2">
        <h2 className="text-xl font-medium">Price Trends</h2>
        <div className="overflow-x-auto rounded-md border">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50">
              <tr>
                <th className="px-3 py-2 text-left">Service</th>
                <th className="px-3 py-2 text-left">Trend</th>
                <th className="px-3 py-2 text-right">% Change</th>
                <th className="px-3 py-2 text-right">Latest Avg</th>
              </tr>
            </thead>
            <tbody>
              {mockTrends.map((t) => {
                const latest = t.data[t.data.length - 1];
                return (
                  <tr key={t.serviceName} className="border-t">
                    <td className="px-3 py-2">{t.serviceName}</td>
                    <td className="px-3 py-2 capitalize">{t.trend}</td>
                    <td className="px-3 py-2 text-right">{t.percentageChange}%</td>
                    <td className="px-3 py-2 text-right">${latest.averagePrice}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-md border p-4 text-sm text-zinc-600 dark:text-zinc-300">
        Alerts and competitor timeline coming soon.
      </section>
    </div>
  );
}

