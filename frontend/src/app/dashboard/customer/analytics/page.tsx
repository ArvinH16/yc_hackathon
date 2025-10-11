"use client";

import { mockPricingAnalytics, mockRevenueOpportunities } from '@/data/mock/mockAnalytics';
import { mockCompetitors } from '@/data/mock/mockBusinesses';

export default function CustomerAnalyticsPage() {
  const competitorsAnalyzed = mockCompetitors.length;

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Customer Analytics</h1>

      <section>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-md border p-4">
            <div className="text-sm text-zinc-500">Competitors Analyzed</div>
            <div className="text-2xl font-medium">{competitorsAnalyzed}</div>
          </div>
          <div className="rounded-md border p-4">
            <div className="text-sm text-zinc-500">Services Tracked</div>
            <div className="text-2xl font-medium">{mockPricingAnalytics.length}</div>
          </div>
          <div className="rounded-md border p-4">
            <div className="text-sm text-zinc-500">Opportunities</div>
            <div className="text-2xl font-medium">{mockRevenueOpportunities.length}</div>
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-medium">Pricing Intelligence</h2>
        <div className="overflow-x-auto rounded-md border">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50">
              <tr>
                <th className="px-3 py-2 text-left">Service</th>
                <th className="px-3 py-2 text-right">Your Price</th>
                <th className="px-3 py-2 text-right">Area Avg</th>
                <th className="px-3 py-2 text-right">Suggested</th>
                <th className="px-3 py-2 text-right">Potential $/mo</th>
              </tr>
            </thead>
            <tbody>
              {mockPricingAnalytics.map((row) => (
                <tr key={row.normalizedName} className="border-t">
                  <td className="px-3 py-2">{row.serviceName}</td>
                  <td className="px-3 py-2 text-right">${row.yourPrice ?? '-'}</td>
                  <td className="px-3 py-2 text-right">${row.areaStats.average}</td>
                  <td className="px-3 py-2 text-right">${row.recommendation.suggestedPrice}</td>
                  <td className="px-3 py-2 text-right">${row.recommendation.potentialRevenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-medium">Revenue Opportunities</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {mockRevenueOpportunities.map((opp) => (
            <div key={opp.id} className="rounded-md border p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-medium">{opp.title}</div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-300">{opp.description}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-zinc-500">Est. Revenue</div>
                  <div className="text-xl font-semibold">${opp.estimatedRevenue}/mo</div>
                </div>
              </div>
              <div className="mt-3 text-sm">
                <div className="font-medium">Action Steps</div>
                <ul className="list-disc pl-5">
                  {opp.actionSteps.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
              {opp.competitors.length > 0 && (
                <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
                  Competitors: {opp.competitors.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

