"use client";

import { mockPricingAnalytics, mockRevenueOpportunities } from '@/data/mock/mockAnalytics';
import { mockCompetitors } from '@/data/mock/mockBusinesses';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import type { ColumnDef } from '@tanstack/react-table';

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

  return (
    <PageContainer>
      <PageHeader title="Customer Analytics" />

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
            <DataTable columns={columns} data={mockPricingAnalytics} pageSize={10} />
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
                    <div className="text-sm text-muted-foreground">{opp.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Est. Revenue</div>
                    <div className="text-xl font-semibold">${opp.estimatedRevenue}/mo</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <div className="font-medium">Action Steps</div>
                  <ul className="list-disc pl-5">
                    {opp.actionSteps.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
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
    </PageContainer>
  );
}
