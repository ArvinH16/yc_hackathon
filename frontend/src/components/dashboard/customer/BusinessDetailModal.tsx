"use client";

import type { SimplifiedBusiness } from '@/types/business';
import { businessLocations } from '@/data/mock/mockLocations';
import rawMockBusiness from '@/data/mock/mockBusiness.json';
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { ResponsiveTabs } from '@/components/ui/responsive-tabs';
import { useViewMode } from '@/components/providers/view-mode-provider';
import { getEffectiveCIConfig } from '@/lib/config';
import { assessCompetitiveness, defaultCustomer, getAIDetectionFor, getLeadForBusiness, suggestionsForClass } from '@/lib/selectors';
import Link from 'next/link';

interface Props {
  business: SimplifiedBusiness | null;
  onClose: () => void;
  defaultTab?: string;
}

export function BusinessDetailModal({ business, onClose, defaultTab }: Props) {
  const { mode } = useViewMode();
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
            {(() => {
              const tabs: { value: string; label: string; content: React.ReactNode }[] = [];
              // Overview tab
              tabs.push({
                value: 'overview',
                label: 'Overview',
                content: (
                  <div className="space-y-4">
                    <div className="rounded-md border p-2 text-xs text-muted-foreground">
                      You're viewing this from {mode === 'customer' ? 'Salon' : 'BeamBell'} view.
                    </div>
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
                ),
              });

              if (mode === 'customer') {
                const cfg = getEffectiveCIConfig('customer');
                const assessment = assessCompetitiveness(business, defaultCustomer(), cfg);
                const label = assessment.class === 'easy_target' ? 'Easy Target' : assessment.class === 'similar' ? 'Similar' : 'Threat';
                const suggestions = suggestionsForClass(assessment.class);
                tabs.push({
                  value: 'edge',
                  label: 'Competitive Edge',
                  content: (
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="font-medium">Classification</div>
                        <div className="mt-1">{label}{assessment.diffPct != null ? ` (${assessment.diffPct.toFixed(1)}%)` : ''}</div>
                      </div>
                      <div>
                        <div className="font-medium">Recommendations</div>
                        <ul className="list-disc pl-5">
                          {suggestions.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-1">
                        <Link href={`/dashboard/business/${encodeURIComponent(business.businessName)}`} className="text-primary underline">
                          Open full profile
                        </Link>
                      </div>
                    </div>
                  ),
                });
              } else {
                // admin (BeamBell) tabs
                const detection = getAIDetectionFor(business.businessName);
                const lead = getLeadForBusiness(business.businessName);
                tabs.push({
                  value: 'ai',
                  label: 'AI Analysis',
                  content: (
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="font-medium">Reception Type</div>
                        <div className="mt-1 capitalize">{detection === 'unknown' ? 'Unknown' : detection}</div>
                      </div>
                      <div>
                        <div className="font-medium">Transcript</div>
                        <div className="mt-1 text-muted-foreground">Transcript available (placeholder)</div>
                        <ul className="mt-2 list-disc pl-5">
                          <li>Agent missed detailed pricing follow-up</li>
                          <li>Slow response on service add-ons</li>
                          <li>Inconsistent booking confirmation path</li>
                        </ul>
                      </div>
                    </div>
                  ),
                });
                tabs.push({
                  value: 'sales',
                  label: 'Sales Actions',
                  content: (
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="font-medium">Suggested Outreach</div>
                        <div className="mt-1">
                          {detection === 'human' && (
                            <>
                              <div className="mb-2">Status: LEAD — Potential customer</div>
                              <div className="rounded-md border p-3 whitespace-pre-wrap">
                                We noticed you're still using manual reception. Beam Bell can save your team time and capture more bookings. Would you be open to a quick demo?
                              </div>
                            </>
                          )}
                          {detection === 'ai' && (
                            <>
                              <div className="mb-2">Status: COMPETITOR — AI user</div>
                              <div className="rounded-md border p-3 whitespace-pre-wrap">
                                We tested your current AI receptionist and found areas for improvement. Here's how Beam Bell outperforms on response speed, escalation, and pricing queries. Open to a head-to-head comparison?
                              </div>
                            </>
                          )}
                          {detection === 'unknown' && (
                            <div className="rounded-md border p-3">Reception type unknown. Recommend quick test call to classify.</div>
                          )}
                        </div>
                      </div>
                      {lead && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-xs text-muted-foreground">Lead Score</div>
                            <div className="text-base font-medium">{lead.leadScore}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Conv. Prob.</div>
                            <div className="text-base font-medium">{Math.round(lead.conversionProbability * 100)}%</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ),
                });
              }

              return (
                <ResponsiveTabs
                  key={defaultTab || 'overview'}
                  defaultValue={defaultTab || 'overview'}
                  tabs={tabs}
                />
              );
            })()}
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={onClose}>Close</Button>
          </DialogFooter>
        </>
      )}
    </ResponsiveDialog>
  );
}
