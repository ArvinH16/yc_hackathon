"use client";

import { useMemo, useState } from 'react';
import {
  Circle,
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
} from 'react-leaflet';

import { mockCompetitors, mockCustomerBusiness } from '@/data/mock/mockBusinesses';
import { businessLocations } from '@/data/mock/mockLocations';
import { useGeolocation } from '@/hooks/useGeolocation';
import { MARKER_COLORS, MILES_TO_METERS } from '@/constants/colors';
import { filterByRadiusByName, getCompetitorColorSimple } from '@/lib/utils';
import type { SimplifiedBusiness } from '@/types/business';
import { BusinessDetailModal } from './BusinessDetailModal';
import { useViewMode } from '@/components/providers/view-mode-provider';
import { getEffectiveCIConfig } from '@/lib/config';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { mockAIStatus } from '@/data/mock/mockAIStatus';
import { hasAgentEvaluation } from '@/lib/selectors';
type ColorMode = 'ai' | 'competitive';

export function MapView({ colorBy = 'ai' }: { colorBy?: ColorMode }) {
  const geo = useGeolocation();
  const [selected, setSelected] = useState<SimplifiedBusiness | null>(null);
  const [defaultTab, setDefaultTab] = useState<string | undefined>(undefined);
  

  const center = useMemo(() => {
    if (!geo.loading && geo.latitude && geo.longitude) {
      return { lat: geo.latitude, lng: geo.longitude };
    }
    // Fallback to customer business location
    const loc = businessLocations[mockCustomerBusiness.businessName];
    return {
      lat: loc?.lat ?? 37.7749,
      lng: loc?.lng ?? -122.4194,
    };
  }, [geo.latitude, geo.longitude, geo.loading]);

  const { mode } = useViewMode();
  const cfg = getEffectiveCIConfig(mode);
  const radiusMiles = cfg.searchRadiusMiles;
  const inRadius = useMemo(
    () => filterByRadiusByName(mockCompetitors, center.lat, center.lng, radiusMiles, businessLocations),
    [center.lat, center.lng, radiusMiles]
  );

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={12}
        className="h-full w-full"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 10 mile radius */}
        <Circle
          center={[center.lat, center.lng]}
          radius={radiusMiles * MILES_TO_METERS}
          pathOptions={{ color: '#3b82f6', fillOpacity: 0.05 }}
        />

        {/* User location marker */}
        {geo.latitude && geo.longitude && (
          <CircleMarker
            center={[geo.latitude, geo.longitude]}
            radius={10}
            pathOptions={{ color: '#2563eb', fillColor: '#2563eb', fillOpacity: 0.9 }}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-medium">Your location</div>
                <div>
                  {geo.latitude.toFixed(4)}, {geo.longitude.toFixed(4)}
                </div>
              </div>
            </Popup>
          </CircleMarker>
        )}

        {/* Competitor markers */}
        {inRadius.map((b) => {
          const isAI = mockAIStatus[b.businessName] === 'ai';
          const color =
            colorBy === 'ai'
              ? (isAI ? MARKER_COLORS.ai_agent : MARKER_COLORS.human)
              : getCompetitorColorSimple(b, mockCustomerBusiness, { ...cfg, aiTakesPrecedence: false });
          const loc = businessLocations[b.businessName];
          if (!loc) return null;
          // In salon view (competitive coloring), add a blue stroke to AI-flagged businesses
          const strokeColor = colorBy === 'competitive' && isAI ? MARKER_COLORS.ai_agent : color;
          const hasEval = hasAgentEvaluation(b.businessName) && mockAIStatus[b.businessName] === 'ai';
          return (
            <CircleMarker
              key={b.businessName}
              center={[loc.lat, loc.lng]}
              radius={8}
              pathOptions={{ color: strokeColor, fillColor: color, fillOpacity: 0.9, weight: (colorBy === 'competitive' && isAI) || hasEval ? 3 : 1 }}
              eventHandlers={{
                click: () => setSelected(b),
              }}
            >
              <Popup>
                <div className="text-sm space-y-2 p-3 pr-4">
                  <div className="font-medium">{b.businessName}</div>
                  <div>
                    {loc.address}, {loc.city}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => {
                        setDefaultTab(undefined);
                        setSelected(b);
                      }}
                    >
                      Quick details
                    </Button>
                    {hasEval && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => {
                          setDefaultTab('ai-eval');
                          setSelected(b);
                        }}
                      >
                        Agent evaluation
                      </Button>
                    )}
                    {mode === 'admin' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => {
                          setDefaultTab('sales');
                          setSelected(b);
                        }}
                      >
                        Sales actions
                      </Button>
                    )}
                    <Link href={`/dashboard/business/${encodeURIComponent(b.businessName)}`}>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                        Open profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Modal */}
      <BusinessDetailModal
        business={selected}
        onClose={() => {
          setSelected(null);
          setDefaultTab(undefined);
        }}
        defaultTab={defaultTab}
      />
    </div>
  );
}
