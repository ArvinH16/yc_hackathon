"use client";

import dynamic from 'next/dynamic';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';

const MapView = dynamic(
  () => import('@/components/dashboard/customer/MapView').then((m) => m.MapView),
  { ssr: false }
);

export default function CustomerMapPage() {
  return (
    <PageContainer className="max-w-6xl">
      <PageHeader title="Customer Map" description="Competitor map with 50-mile radius" />
      <div className="h-[70vh] w-full rounded-lg border">
        <MapView />
      </div>
    </PageContainer>
  );
}
