"use client";

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { MapLegend } from '@/components/dashboard/customer/MapLegend';
import { Card } from '@/components/ui/card';
import { useViewMode } from '@/components/providers/view-mode-provider';
import { getEffectiveCIConfig } from '@/lib/config';
import { Collapsible } from '@/components/ui/collapsible';
import { Select } from '@/components/ui/select';

const MapView = dynamic(
  () => import('@/components/dashboard/customer/MapView').then((m) => m.MapView),
  { ssr: false }
);

export default function CustomerMapPage() {
  const { mode } = useViewMode();
  const cfg = getEffectiveCIConfig(mode);
  const showLegend = cfg.map?.showLegend !== false;
  const [colorBy, setColorBy] = useState<'ai' | 'competitive'>('ai');
  return (
    <PageContainer size="wide">
      <PageHeader title="Map" description="Competitor map with 10-mile radius" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <div className="flex items-center justify-end gap-2 p-3">
            <label htmlFor="colorBy" className="text-sm">Color by</label>
            <Select id="colorBy" value={colorBy} onChange={(e) => setColorBy(e.target.value as 'ai' | 'competitive')} className="w-40">
              <option value="ai">AI status</option>
              <option value="competitive">Competitive positioning</option>
            </Select>
          </div>
          <div className="h-[55vh] w-full rounded-lg md:h-[70vh]">
            <MapView colorBy={colorBy} />
          </div>
        </Card>
        <div className="md:col-span-1">
          {showLegend && (
            <div className="sticky top-20">
              <div className="md:hidden">
                <Collapsible
                  defaultOpen={false}
                  trigger={
                    <div className="flex items-center justify-between rounded-md border bg-background p-3 text-sm">
                      <span className="font-medium">Legend</span>
                      <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M7 10l5 5 5-5z"/></svg>
                    </div>
                  }
                >
                  <div className="mt-2">
                    <MapLegend mode={colorBy} />
                  </div>
                </Collapsible>
              </div>
              <div className="hidden md:block">
                <MapLegend mode={colorBy} />
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
