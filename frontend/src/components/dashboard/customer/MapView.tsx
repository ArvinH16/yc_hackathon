"use client";

import { useMemo, useState } from 'react';
import {
  Circle,
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from 'react-leaflet';

import { mockCompetitors, mockCustomerBusiness } from '@/data/mock/mockBusinesses';
import { useGeolocation } from '@/hooks/useGeolocation';
import { MILES_TO_METERS, SEARCH_RADIUS_MILES } from '@/constants/colors';
import { filterByRadius, getCompetitorColor } from '@/lib/utils';
import type { Business } from '@/types/business';
import { MapLegend } from './MapLegend';
import { BusinessDetailModal } from './BusinessDetailModal';

export function MapView() {
  const geo = useGeolocation();
  const [selected, setSelected] = useState<Business | null>(null);

  const center = useMemo(() => {
    if (!geo.loading && geo.latitude && geo.longitude) {
      return { lat: geo.latitude, lng: geo.longitude };
    }
    // Fallback to customer business location
    return {
      lat: mockCustomerBusiness.location.lat,
      lng: mockCustomerBusiness.location.lng,
    };
  }, [geo.latitude, geo.longitude, geo.loading]);

  const inRadius = useMemo(
    () => filterByRadius(mockCompetitors, center.lat, center.lng, SEARCH_RADIUS_MILES),
    [center.lat, center.lng]
  );

  return (
    <div className="relative h-[calc(100vh-0px)] w-full">
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

        {/* 50 mile radius */}
        <Circle
          center={[center.lat, center.lng]}
          radius={SEARCH_RADIUS_MILES * MILES_TO_METERS}
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
          const color = getCompetitorColor(b, mockCustomerBusiness);
          return (
            <CircleMarker
              key={b.id}
              center={[b.location.lat, b.location.lng]}
              radius={8}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.9 }}
              eventHandlers={{
                click: () => setSelected(b),
              }}
            >
              <Popup>
                <div className="text-sm space-y-1">
                  <div className="font-medium">{b.name}</div>
                  <div>
                    {b.location.address}, {b.location.city}
                  </div>
                  <button
                    className="mt-1 rounded border px-2 py-1 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    onClick={() => setSelected(b)}
                  >
                    View details
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Legend and Modal */}
      <MapLegend />
      <BusinessDetailModal business={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
