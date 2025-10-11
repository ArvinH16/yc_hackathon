"use client";

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { mockCompetitors } from '@/data/mock/mockBusinesses';
import { competitorProfiles } from '@/data/mock/mockCompanyProfiles';
import { businessLocations } from '@/data/mock/mockLocations';

export default function BusinessProfilePage() {
  const params = useParams<{ id: string }>();
  const name = decodeURIComponent(params.id);

  const biz = useMemo(() => mockCompetitors.find((b) => b.businessName === name), [name]);
  const profile = useMemo(() => competitorProfiles.find((p) => p.businessName === name), [name]);

  if (!biz) {
    return (
      <PageContainer>
        <PageHeader title="Business Not Found" />
        <Card>
        <CardContent className="p-4 text-sm text-muted-foreground">We couldn&apos;t find a business named &quot;{name}&quot;.</CardContent>
        </Card>
      </PageContainer>
    );
  }

  const whatTheyDo = profile?.description ?? `Offers ${biz.services.slice(0,3).join(', ')}${biz.services.length > 3 ? ' and more' : ''}.`;

  return (
    <PageContainer>
      <PageHeader
        title={biz.businessName}
        description={profile?.tagline}
        actions={
          <div className="flex gap-2">
            <Link href="/dashboard/customer/map">
              <Button variant="secondary">Back to Map</Button>
            </Link>
            <Link href="/dashboard/customer/analytics">
              <Button>Analytics</Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>Who they are and what they do</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>{whatTheyDo}</div>
            {profile?.specialties && (
              <div>
                <div className="mb-1 font-medium">Specialties</div>
                <div className="flex flex-wrap gap-2">{profile.specialties.map((s) => <Badge key={s}>{s}</Badge>)}</div>
              </div>
            )}
            <div>
              <div className="mb-1 font-medium">Top Services</div>
              <ul className="list-disc pl-5">
                {biz.services.slice(0,6).map((s) => (
                  <li key={s}>{s}{biz.prices[s] ? ` — $${biz.prices[s]}` : ''}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Business Info</CardTitle>
            <CardDescription>Basics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <div className="font-medium">Category</div>
              <div className="mt-1"><Badge variant="secondary" className="capitalize">{biz.industry}</Badge></div>
            </div>
            <Separator />
            <div>
              <div className="font-medium">Address</div>
              <div className="mt-1">{(() => { const loc = businessLocations[biz.businessName]; return loc ? `${loc.address}, ${loc.city}, ${loc.state} ${loc.zipCode}` : '—'; })()}</div>
            </div>
            <div>
              <div className="font-medium">Contact</div>
              <div className="mt-1">Phone: {biz.phone}</div>
            </div>
            {/* AI detection removed in simplified model */}
          </CardContent>
        </Card>
      </div>

      {/* Competitive edge cards removed in simplified model */}
    </PageContainer>
  );
}
