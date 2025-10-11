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

export default function BusinessProfilePage() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);

  const biz = useMemo(() => mockCompetitors.find((b) => b.id === id), [id]);
  const profile = useMemo(() => competitorProfiles.find((p) => p.businessId === id), [id]);

  if (!biz) {
    return (
      <PageContainer>
        <PageHeader title="Business Not Found" />
        <Card>
          <CardContent className="p-4 text-sm text-muted-foreground">We couldn&apos;t find a business with id &quot;{id}&quot;.</CardContent>
        </Card>
      </PageContainer>
    );
  }

  const whatTheyDo = profile?.description ?? `Offers ${biz.services.map((s) => s.name).slice(0,3).join(', ')}${biz.services.length > 3 ? ' and more' : ''}.`;

  return (
    <PageContainer>
      <PageHeader
        title={biz.name}
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
                  <li key={s.id}>{s.name}{s.price ? ` — $${s.price}` : ''}</li>
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
              <div className="mt-1"><Badge variant="secondary" className="capitalize">{biz.type}</Badge></div>
            </div>
            <Separator />
            <div>
              <div className="font-medium">Address</div>
              <div className="mt-1">{biz.location.address}, {biz.location.city}, {biz.location.state} {biz.location.zipCode}</div>
            </div>
            <div>
              <div className="font-medium">Contact</div>
              <div className="mt-1">Phone: {biz.phone}</div>
              {biz.website && <div>Website: <a href={biz.website} target="_blank" rel="noreferrer" className="text-primary underline">{biz.website}</a></div>}
            </div>
            <div>
              <div className="font-medium">AI Detection</div>
              <div className="mt-1 capitalize">{biz.aiDetection.isAI ? 'Uses AI' : 'Human'} — confidence {Math.round(biz.aiDetection.confidence * 100)}%</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {biz.competitiveEdge && (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader><CardTitle>Advantages</CardTitle></CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-sm">{biz.competitiveEdge.advantages.map((a, i) => <li key={i}>{a}</li>)}</ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Opportunities</CardTitle></CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-sm">{biz.competitiveEdge.opportunities.map((a, i) => <li key={i}>{a}</li>)}</ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Threats</CardTitle></CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-sm">{biz.competitiveEdge.threats.map((a, i) => <li key={i}>{a}</li>)}</ul>
            </CardContent>
          </Card>
        </div>
      )}
    </PageContainer>
  );
}

