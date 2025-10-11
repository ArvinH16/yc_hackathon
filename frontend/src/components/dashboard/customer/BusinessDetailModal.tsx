"use client";

import type { Business } from '@/types/business';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { ResponsiveTabs } from '@/components/ui/responsive-tabs';

interface Props {
  business: Business | null;
  onClose: () => void;
}

export function BusinessDetailModal({ business, onClose }: Props) {
  return (
    <ResponsiveDialog open={!!business} onOpenChange={(o) => !o && onClose()} title={business?.name}>
      {business && (
        <>
          <DialogHeader className="hidden md:block">
            <DialogTitle>{business.name}</DialogTitle>
            <DialogDescription>
              {business.location.address}, {business.location.city}, {business.location.state}
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
                          {business.website && (
                            <div>
                              Website: <a className="text-primary underline" href={business.website} target="_blank" rel="noreferrer">{business.website}</a>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="font-medium">Top Services</div>
                        <ul className="list-disc pl-5 text-sm">
                          {business.services.slice(0, 3).map((s) => (
                            <li key={s.id}>
                              {s.name} — ${s.price}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                },
                business.competitiveEdge ? {
                  value: 'edge',
                  label: 'Competitive Edge',
                  content: (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div>
                        <div className="font-medium">Advantages</div>
                        <ul className="list-disc pl-5 text-sm">
                          {business.competitiveEdge.advantages.map((a, idx) => (
                            <li key={`adv-${idx}`}>{a}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="font-medium">Opportunities</div>
                        <ul className="list-disc pl-5 text-sm">
                          {business.competitiveEdge.opportunities.map((o, idx) => (
                            <li key={`opp-${idx}`}>{o}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="font-medium">Threats</div>
                        <ul className="list-disc pl-5 text-sm">
                          {business.competitiveEdge.threats.map((t, idx) => (
                            <li key={`thr-${idx}`}>{t}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                } : undefined,
              ].filter(Boolean) as { value: string; label: string; content: React.ReactNode }[]}
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
