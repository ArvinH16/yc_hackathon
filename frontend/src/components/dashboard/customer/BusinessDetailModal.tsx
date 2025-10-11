"use client";

import type { SimplifiedBusiness } from '@/types/business';
import { businessLocations } from '@/data/mock/mockLocations';
import rawMockBusiness from '@/data/mock/mockBusiness.json';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { ResponsiveTabs } from '@/components/ui/responsive-tabs';

interface Props {
  business: SimplifiedBusiness | null;
  onClose: () => void;
}

export function BusinessDetailModal({ business, onClose }: Props) {
  return (
    <ResponsiveDialog open={!!business} onOpenChange={(o) => !o && onClose()} title={business?.businessName}>
      {business && (
        <>
          <DialogHeader className="hidden md:block">
            <DialogTitle>{business.businessName}</DialogTitle>
            <DialogDescription>
              {(() => {
                const loc = businessLocations[business.businessName];
                if (loc) return `${loc.address}, ${loc.city}, ${loc.state}`;
                const j: any = rawMockBusiness as any;
                const jl = j?.location;
                return jl && jl.address && jl.city && jl.state ? `${jl.address}, ${jl.city}, ${jl.state}` : '';
              })()}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 md:mt-4">
            <ResponsiveTabs
              defaultValue="overview"
              tabs={[
                {
                  value: 'overview',
                  label: 'Overview',
                  content: (
                    <div className="space-y-4">
                      <div>
                        <div className="font-medium">Contact</div>
                        <div className="text-sm">
                          <div>Phone: {business.phone}</div>
                          {business.email && <div>Email: {business.email}</div>}
                        </div>
                      </div>

                      <div>
                        <div className="font-medium">Top Services</div>
                        <ul className="list-disc pl-5 text-sm">
                          {business.services.slice(0, 3).map((name) => (
                            <li key={name}>
                              {name}{business.prices[name] ? ` — $${business.prices[name]}` : ''}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                },
              ]}
            />
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={onClose}>Close</Button>
          </DialogFooter>
        </>
      )}
    </ResponsiveDialog>
  );
}
