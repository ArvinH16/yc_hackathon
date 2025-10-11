"use client";

import { mockTrends } from '@/data/mock/mockTrends';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useViewMode } from '@/components/providers/view-mode-provider';
import { getEffectiveCIConfig } from '@/lib/config';
import { summarizeLeads, getAIUsageCounts } from '@/lib/selectors';

export default function CustomerMonitoringPage() {
  const { mode } = useViewMode();
  const cfg = getEffectiveCIConfig(mode);
  const rows = mockTrends.slice(0, cfg.monitoring?.maxRows ?? mockTrends.length);
  return (
    <PageContainer>
      <PageHeader title="Market Monitoring" description="Track market trends; admin adds AI adoption and outreach activity." />

      {mode === 'customer' ? (
        <>
          <section className="space-y-2">
            <h2 className="text-xl font-medium">Price Trends</h2>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead>Trend</TableHead>
                        <TableHead className="text-right">% Change</TableHead>
                        <TableHead className="text-right">Latest Avg</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map((t) => {
                        const latest = t.data[t.data.length - 1];
                        return (
                          <TableRow key={t.serviceName}>
                            <TableCell>{t.serviceName}</TableCell>
                            <TableCell className="capitalize">{t.trend}</TableCell>
                            <TableCell className="text-right">{t.percentageChange}%</TableCell>
                            <TableCell className="text-right">${latest.averagePrice}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </section>

          <Card className="mt-6">
            <CardContent className="p-4 text-sm text-muted-foreground">
              Alerts and competitor timeline coming soon.
            </CardContent>
          </Card>
        </>
      ) : (
        // admin (BeamBell) view
        <>
          {(() => {
            const leadSummary = summarizeLeads();
            const aiCounts = getAIUsageCounts();
            const statusRows = Array.from(leadSummary.byStatus.entries());
            return (
              <>
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
                      <div className="text-sm text-muted-foreground">Total Competitors</div>
                      <CardTitle className="text-2xl">{aiCounts.total}</CardTitle>
                    </CardHeader>
                  </Card>
                </section>

                <section className="mt-8 space-y-2">
                  <h2 className="text-xl font-medium">Outreach Activity</h2>
                  <Card>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Count</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {statusRows.map(([status, count]) => (
                              <TableRow key={status}>
                                <TableCell className="capitalize">{status.replaceAll('_', ' ')}</TableCell>
                                <TableCell className="text-right">{count}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </section>
              </>
            );
          })()}
        </>
      )}
    </PageContainer>
  );
}
