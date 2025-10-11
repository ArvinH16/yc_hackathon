"use client";

import { mockTrends } from '@/data/mock/mockTrends';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function CustomerMonitoringPage() {
  return (
    <PageContainer>
      <PageHeader title="Market Monitoring" />

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
                  {mockTrends.map((t) => {
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
    </PageContainer>
  );
}
