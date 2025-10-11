"use client";

import type { Business } from '@/types/business';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Props {
  business: Business | null;
  onClose: () => void;
}

export function BusinessDetailModal({ business, onClose }: Props) {
  return (
    <Dialog open={!!business} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        {business && (
          <>
            <DialogHeader>
              <DialogTitle>{business.name}</DialogTitle>
              <DialogDescription>
                {business.location.address}, {business.location.city}, {business.location.state}
              </DialogDescription>
            </DialogHeader>
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
                <ul className="text-sm list-disc pl-4">
                  {business.services.slice(0, 3).map((s) => (
                    <li key={s.id}>
                      {s.name} — ${s.price}
                    </li>
                  ))}
                </ul>
              </div>

              {business.competitiveEdge && (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div>
                    <div className="font-medium">Advantages</div>
                    <ul className="text-sm list-disc pl-4">
                      {business.competitiveEdge.advantages.map((a, idx) => (
                        <li key={`adv-${idx}`}>{a}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="font-medium">Opportunities</div>
                    <ul className="text-sm list-disc pl-4">
                      {business.competitiveEdge.opportunities.map((o, idx) => (
                        <li key={`opp-${idx}`}>{o}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="font-medium">Threats</div>
                    <ul className="text-sm list-disc pl-4">
                      {business.competitiveEdge.threats.map((t, idx) => (
                        <li key={`thr-${idx}`}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Close</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
