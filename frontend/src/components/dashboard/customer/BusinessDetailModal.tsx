"use client";

import type { Business } from '@/types/business';
import { Fragment } from 'react';

interface Props {
  business: Business | null;
  onClose: () => void;
}

export function BusinessDetailModal({ business, onClose }: Props) {
  if (!business) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-[92vw] max-w-xl rounded-md bg-white p-4 shadow-lg dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">{business.name}</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              {business.location.address}, {business.location.city}, {business.location.state}
            </p>
          </div>
          <button
            className="rounded-md border px-2 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <div className="font-medium">Contact</div>
            <div className="text-sm">
              <div>Phone: {business.phone}</div>
              {business.website && (
                <div>
                  Website: <a className="text-blue-600" href={business.website} target="_blank" rel="noreferrer">{business.website}</a>
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
      </div>
    </div>
  );
}

