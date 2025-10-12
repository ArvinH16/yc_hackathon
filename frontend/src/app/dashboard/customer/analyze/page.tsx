"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function AnalyzeNearbyPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const steps = useMemo(
    () => [
      'Calling nearby competitors to test receptionist',
      'Measuring response speed and interruptions',
      'Classifying AI vs human receptionist',
      'Extracting pricing and availability cues',
      'Geolocating and filtering by radius',
      'Preparing evaluation markers and summaries',
    ],
    []
  );

  useEffect(() => {
    const totalMs = 6000;
    const intervalMs = Math.floor(totalMs / steps.length);
    const id = setInterval(() => setStep((s) => Math.min(s + 1, steps.length - 1)), intervalMs);
    const to = setTimeout(() => {
      router.replace('/dashboard/customer/map');
    }, totalMs);
    return () => {
      clearInterval(id);
      clearTimeout(to);
    };
  }, [router, steps.length]);

  const progress = Math.round(((step + 1) / steps.length) * 100);

  return (
    <PageContainer>
      <PageHeader title="Analyzing Nearby Competitors" description="Simulating data collection and evaluation workflow" />
      <Card>
        <CardHeader>
          <CardTitle>Analyze nearby competitors</CardTitle>
          <CardDescription>Calling agents, gathering metrics, and preparing the map</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <LoadingSpinner size={28} />
            <div className="text-sm text-muted-foreground">{steps[step]}</div>
          </div>
          <div className="mt-4 h-2 w-full rounded bg-muted">
            <div className="h-2 rounded bg-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
          <ul className="mt-4 space-y-1 text-sm">
            {steps.map((label, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className={i <= step ? 'text-primary' : 'text-muted-foreground'}>
                  {i < step ? '✓' : i === step ? '•' : '○'}
                </span>
                <span className={i <= step ? '' : 'text-muted-foreground'}>{label}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-right text-[11px] text-muted-foreground">Powered by Coval</div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

