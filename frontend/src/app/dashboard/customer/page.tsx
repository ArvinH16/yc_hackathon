"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { mockCustomerBusiness } from "@/data/mock/mockBusinesses";
import { businessLocations } from "@/data/mock/mockLocations";
import rawMockBusiness from "@/data/mock/mockBusiness.json";
import { customerProfile } from "@/data/mock/mockCompanyProfiles";
import { defaultCIConfig } from "@/data/mock/mockCIConfig";
import Link from "next/link";
import { useViewMode } from "@/components/providers/view-mode-provider";

export default function CustomerOverviewPage() {
  const biz = mockCustomerBusiness;
  const profile = customerProfile;
  const cfg = defaultCIConfig;
  const { mode } = useViewMode();

  return (
    <PageContainer>
      <PageHeader title={biz.businessName} description={profile.tagline} actions={
        <div className="flex gap-2">
          <Link href="/dashboard/customer/map">
            <Button variant="secondary">Open Map</Button>
          </Link>
          <Link href="/dashboard/customer/analytics">
            <Button>Analytics</Button>
          </Link>
          <Link href="/dashboard/customer/monitoring">
            <Button variant="outline">Monitoring</Button>
          </Link>
        </div>
      } />

      <div className="mb-2 text-xs text-muted-foreground">You're viewing this from {mode === 'customer' ? 'Salon' : 'BeamBell'} view.</div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>Who we are and what we do</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">{profile.description}</div>
            {profile.specialties && profile.specialties.length > 0 && (
              <div className="text-sm">
                <div className="mb-1 font-medium">Specialties</div>
                <div className="flex flex-wrap gap-2">
                  {profile.specialties.map((s) => (
                    <Badge key={s}>{s}</Badge>
                  ))}
                </div>
              </div>
            )}
            {profile.notes && profile.notes.length > 0 && (
              <div className="text-sm">
                <div className="mb-1 font-medium">Notes</div>
                <ul className="list-disc pl-5">
                  {profile.notes.map((n, i) => <li key={i}>{n}</li>)}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Info</CardTitle>
            <CardDescription>Basics at a glance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <div className="font-medium">Category</div>
              <div className="mt-1"><Badge variant="secondary" className="mr-1 capitalize">{biz.industry}</Badge></div>
            </div>
            <Separator />
            <div>
              <div className="font-medium">Address</div>
              <div className="mt-1">{(() => {
                const loc = businessLocations[biz.businessName];
                if (loc) return `${loc.address}, ${loc.city}, ${loc.state} ${loc.zipCode}`;
                const j: any = rawMockBusiness as any;
                const jl = j?.location;
                if (jl && jl.address && jl.city && jl.state && jl.zip) {
                  return `${jl.address}, ${jl.city}, ${jl.state} ${jl.zip}`;
                }
                return '—';
              })()}</div>
            </div>
            <div>
              <div className="font-medium">Contact</div>
              <div className="mt-1">Phone: {biz.phone}</div>
            </div>
            {profile.hours && (
              <div>
                <div className="font-medium">Hours</div>
                <div className="mt-1 grid grid-cols-2 gap-x-3">
                  {profile.hours.map((h) => (
                    <div key={h.day} className="flex justify-between"><span>{h.day}</span><span>{h.open} – {h.close}</span></div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Default CI Config</CardTitle>
            <CardDescription>Used across dashboards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between"><span>Search radius</span><span className="font-medium">{cfg.searchRadiusMiles} miles</span></div>
            <div>
              <div className="font-medium">Include types</div>
              <div className="mt-1 flex flex-wrap gap-2">
                {cfg.includeTypes.map((t) => <Badge key={t} variant="secondary" className="capitalize">{t}</Badge>)}
              </div>
            </div>
            <div>
              <div className="font-medium">Price bands</div>
              <div className="mt-1">Easy target ≤ {cfg.thresholds.easyTargetBelowPct}% cheaper</div>
              <div>Similar ±{cfg.thresholds.similarBandPct}%</div>
              <div>Threat otherwise</div>
            </div>
            <div className="flex items-center justify-between"><span>AI precedence</span><span className="font-medium">{cfg.aiTakesPrecedence ? 'On' : 'Off'}</span></div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Common workflows</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Link href="/dashboard/customer/map">
              <Button>Open Competitor Map</Button>
            </Link>
            <Link href="/dashboard/customer/analytics">
              <Button variant="secondary">View Pricing Intelligence</Button>
            </Link>
            <Link href="/dashboard/customer/monitoring">
              <Button variant="outline">Monitor Market Trends</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
