"use client";
import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { useViewMode } from '@/components/providers/view-mode-provider';

export default function Home() {
  const { toast } = useToast();
  const { mode, setMode } = useViewMode();
  const linksBase = [
    { href: '/dashboard/customer/map', title: 'Map', desc: 'Competitor map with 10-mile radius' },
    { href: '/dashboard/customer/analytics', title: 'Analytics', desc: 'Pricing intelligence and opportunities' },
    { href: '/dashboard/customer/monitoring', title: 'Monitoring', desc: 'Trends and alerts' },
  ];
  const links = mode === 'admin'
    ? [...linksBase, { href: '/dashboard/crm/leads', title: 'Leads', desc: 'Lead list and outreach status' }]
    : linksBase;

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
      {mode === 'admin' ? (
        <div className="mb-4">
          <div className="mb-2 text-sm text-muted-foreground">BeamBell AI demo</div>
          <div className="flex gap-2">
            <a
              href="https://app.coval.dev/beambell/runs/buxXcfdhyKtzufnWsTgFFU"
              target="_blank"
              rel="noreferrer"
              aria-label="Open BeamBell AI demo run in a new tab (Coval)"
              className="inline-flex"
            >
              <Button variant="outline">Open BeamBell AI Demo</Button>
            </a>
            <Button
              variant="ghost"
              onClick={() => navigator.clipboard?.writeText('https://app.coval.dev/beambell/runs/buxXcfdhyKtzufnWsTgFFU')}
            >
              Copy demo link
            </Button>
          </div>
        </div>
      ) : null}
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
