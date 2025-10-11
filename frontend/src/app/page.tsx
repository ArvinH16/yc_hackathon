"use client";
import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

export default function Home() {
  const { toast } = useToast();
  const links = [
    { href: '/dashboard/customer/map', title: 'Customer — Map', desc: 'Competitor map with 50-mile radius' },
    { href: '/dashboard/customer/analytics', title: 'Customer — Analytics', desc: 'Pricing intelligence and opportunities' },
    { href: '/dashboard/customer/monitoring', title: 'Customer — Monitoring', desc: 'Trends and alerts' },
    { href: '/dashboard/crm/leads', title: 'CRM — Leads', desc: 'Lead list and outreach status' },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Beam Bell Competitive Intelligence"
        description="Navigate to key dashboards using the tiles below."
        actions={(
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => toast({ title: 'Success', description: 'This is a sample success toast.', variant: 'success' })}
            >
              Demo Success
            </Button>
            <Button
              variant="destructive"
              onClick={() => toast({ title: 'Error', description: 'This is a sample error toast.', variant: 'destructive' })}
            >
              Demo Error
            </Button>
          </div>
        )}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {links.map((l) => (
          <Card key={l.href}>
            <CardHeader>
              <CardTitle>{l.title}</CardTitle>
              <CardDescription>{l.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={l.href}>
                <Button>Open</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
