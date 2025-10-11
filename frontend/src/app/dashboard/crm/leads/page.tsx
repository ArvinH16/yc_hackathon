"use client";

import { mockLeads } from '@/data/mock/mockLeads';
import { mockCompetitors } from '@/data/mock/mockBusinesses';

export default function LeadsPage() {
  const businessNameById = new Map(mockCompetitors.map((b) => [b.id, b.name] as const));

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">CRM — Leads</h1>

      <div className="overflow-x-auto rounded-md border">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-900/50">
            <tr>
              <th className="px-3 py-2 text-left">Business</th>
              <th className="px-3 py-2 text-right">Lead Score</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-right">Emails</th>
              <th className="px-3 py-2 text-right">Conv. Prob.</th>
            </tr>
          </thead>
          <tbody>
            {mockLeads.map((lead, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-3 py-2">
                  {businessNameById.get(lead.businessId) ?? lead.businessId}
                </td>
                <td className="px-3 py-2 text-right">{lead.leadScore}</td>
                <td className="px-3 py-2 capitalize">{lead.outreachStatus.replaceAll('_', ' ')}</td>
                <td className="px-3 py-2 text-right">{lead.emailsSent}</td>
                <td className="px-3 py-2 text-right">{Math.round(lead.conversionProbability * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

