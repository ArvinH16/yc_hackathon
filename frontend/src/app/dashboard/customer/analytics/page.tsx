"use client";

import { mockPricingAnalytics, mockRevenueOpportunities } from '@/data/mock/mockAnalytics';
import { mockCompetitors } from '@/data/mock/mockBusinesses';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import type { ColumnDef } from '@tanstack/react-table';
import { useViewMode } from '@/components/providers/view-mode-provider';
import { getEffectiveCIConfig } from '@/lib/config';
import { ExpandableText } from '@/components/ui/expandable-text';
import { Collapsible } from '@/components/ui/collapsible';
import { summarizeLeads, getAIUsageCounts } from '@/lib/selectors';
import { mockLeads } from '@/data/mock/mockLeads';

type Row = typeof mockPricingAnalytics[number];

const columns: ColumnDef<Row>[] = [
  { accessorKey: 'serviceName', header: 'Service' },
  { accessorKey: 'yourPrice', header: 'Your Price', cell: ({ row }) => <div className="text-right">${row.original.yourPrice ?? '-'}</div> },
  { accessorFn: (r) => r.areaStats.average, id: 'areaAvg', header: 'Area Avg', cell: ({ row }) => <div className="text-right">${row.original.areaStats.average}</div> },
  { accessorFn: (r) => r.recommendation.suggestedPrice, id: 'suggested', header: 'Suggested', cell: ({ row }) => <div className="text-right">${row.original.recommendation.suggestedPrice}</div> },
  { accessorFn: (r) => r.recommendation.potentialRevenue, id: 'potential', header: 'Potential $/mo', cell: ({ row }) => <div className="text-right">${row.original.recommendation.potentialRevenue}</div> },
];

export default function CustomerAnalyticsPage() {
  const competitorsAnalyzed = mockCompetitors.length;
  const { mode } = useViewMode();
  const cfg = getEffectiveCIConfig(mode);

  return (
    <PageContainer>
      <PageHeader title="Analytics" description="Analyze pricing and opportunities; admin adds lead and AI insights." />

      {mode === 'customer' ? (
        <>
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="text-sm text-muted-foreground">Competitors Analyzed</div>
                <CardTitle className="text-2xl">{competitorsAnalyzed}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="text-sm text-muted-foreground">Services Tracked</div>
                <CardTitle className="text-2xl">{mockPricingAnalytics.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="text-sm text-muted-foreground">Opportunities</div>
                <CardTitle className="text-2xl">{mockRevenueOpportunities.length}</CardTitle>
              </CardHeader>
            </Card>
          </section>

          <section className="mt-8 space-y-2">
            <h2 className="text-xl font-medium">Pricing Intelligence</h2>
            <Card>
              <CardContent className="p-4">
                <DataTable columns={columns} data={mockPricingAnalytics} pageSize={cfg.analytics.defaultPageSize} />
              </CardContent>
            </Card>
          </section>

          <section className="mt-8 space-y-2">
            <h2 className="text-xl font-medium">Revenue Opportunities</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {mockRevenueOpportunities.map((opp) => (
                <Card key={opp.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg">{opp.title}</CardTitle>
                        <ExpandableText className="text-sm text-muted-foreground" maxLength={140}>
                          {opp.description}
                        </ExpandableText>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Est. Revenue</div>
                        <div className="text-xl font-semibold">${opp.estimatedRevenue}/mo</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <Collapsible
                        defaultOpen={false}
                        trigger={<div className="font-medium underline hover:no-underline cursor-pointer">View action steps</div>}
                      >
                        <ul className="list-disc pl-5 mt-2">
                          {opp.actionSteps.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </Collapsible>
                    </div>
                    {opp.competitors.length > 0 && (
                      <div className="mt-3 text-sm text-muted-foreground">
                        Competitors: {opp.competitors.join(', ')}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </>
      ) : (
        // admin (BeamBell) view
        <>
          {(() => {
            const leadSummary = summarizeLeads();
            const aiCounts = getAIUsageCounts();
            const emailsSentTotal = mockLeads.reduce((a, b) => a + (b.emailsSent || 0), 0);

            const leadColumns: ColumnDef<typeof mockLeads[number]>[] = [
              {
                header: 'Business',
                accessorKey: 'businessName',
                cell: ({ row }) => (
                  <a href={`/dashboard/business/${encodeURIComponent(row.original.businessName)}`} className="text-primary underline">
                    {row.original.businessName}
                  </a>
                ),
              },
              { header: 'Lead Score', accessorKey: 'leadScore', cell: ({ row }) => <div className="text-right">{row.original.leadScore}</div> },
              { header: 'Status', accessorKey: 'outreachStatus', cell: ({ row }) => <span className="capitalize">{row.original.outreachStatus.replaceAll('_', ' ')}</span> },
              { header: 'Conv. Prob.', accessorKey: 'conversionProbability', cell: ({ row }) => <div className="text-right">{Math.round(row.original.conversionProbability * 100)}%</div> },
            ];

            return (
              <>
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <div className="text-sm text-muted-foreground">Total Leads</div>
                      <CardTitle className="text-2xl">{leadSummary.total}</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader>
                      <div className="text-sm text-muted-foreground">Avg Lead Score</div>
                      <CardTitle className="text-2xl">{leadSummary.avgLeadScore}</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader>
                      <div className="text-sm text-muted-foreground">Emails Sent</div>
                      <CardTitle className="text-2xl">{emailsSentTotal}</CardTitle>
                    </CardHeader>
                  </Card>
                </section>

                <section className="mt-8 space-y-2">
                  <h2 className="text-xl font-medium">Top Conversion Candidates</h2>
                  <Card>
                    <CardContent className="p-4">
                      <DataTable columns={leadColumns} data={leadSummary.topByConversion} pageSize={Math.min(leadSummary.topByConversion.length, cfg.crm?.defaultPageSize ?? 10)} />
                    </CardContent>
                  </Card>
                </section>

                <section className="mt-8 space-y-2">
                  <h2 className="text-xl font-medium">AI Usage Overview</h2>
                  <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card>
                      <CardHeader>
                        <div className="text-sm text-muted-foreground">AI Competitors</div>
                        <CardTitle className="text-2xl">{aiCounts.ai}</CardTitle>
                      </CardHeader>
                    </Card>
                    <Card>
                      <CardHeader>
                        <div className="text-sm text-muted-foreground">Human Competitors</div>
                        <CardTitle className="text-2xl">{aiCounts.human}</CardTitle>
                      </CardHeader>
                    </Card>
                    <Card>
                      <CardHeader>
                        <div className="text-sm text-muted-foreground">Total</div>
                        <CardTitle className="text-2xl">{aiCounts.total}</CardTitle>
                      </CardHeader>
                    </Card>
                  </section>
                </section>
              </>
            );
          })()}
        </>
      )}
    </PageContainer>
  );
}
