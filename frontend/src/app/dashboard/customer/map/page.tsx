"use client";

import dynamic from 'next/dynamic';

const MapView = dynamic(
  () => import('@/components/dashboard/customer/MapView').then((m) => m.MapView),
  { ssr: false }
);

export default function CustomerMapPage() {
  return (
    <div className="h-screen w-full">
      <MapView />
    </div>
  );
}

