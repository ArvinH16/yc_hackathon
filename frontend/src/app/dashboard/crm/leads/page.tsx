"use client";

import { mockLeads } from '@/data/mock/mockLeads';
import { mockCompetitors } from '@/data/mock/mockBusinesses';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useMemo, useState } from 'react';
import { useViewMode } from '@/components/providers/view-mode-provider';
import { getEffectiveCIConfig } from '@/lib/config';

type Row = typeof mockLeads[number];

export default function LeadsPage() {
  const businessNameById = useMemo(() => new Map(mockCompetitors.map((b) => [b.id, b.name] as const)), []);
  const { mode } = useViewMode();
  const cfg = getEffectiveCIConfig(mode);

  const columns: ColumnDef<Row>[] = [
    {
      header: 'Business',
      accessorKey: 'businessId',
      cell: ({ row }) => {
        const id = row.original.businessId;
        const label = businessNameById.get(id) ?? id;
        return <a href={`/dashboard/business/${encodeURIComponent(id)}`} className="text-primary underline">{label}</a>;
      },
    },
    { header: 'Lead Score', accessorKey: 'leadScore', cell: ({ row }) => <div className="text-right">{row.original.leadScore}</div> },
    { header: 'Status', accessorKey: 'outreachStatus', cell: ({ row }) => <span className="capitalize">{row.original.outreachStatus.replaceAll('_', ' ')}</span> },
    { header: 'Emails', accessorKey: 'emailsSent', cell: ({ row }) => <div className="text-right">{row.original.emailsSent}</div> },
    { header: 'Conv. Prob.', accessorKey: 'conversionProbability', cell: ({ row }) => <div className="text-right">{Math.round(row.original.conversionProbability * 100)}%</div> },
  ];

  // Toolbar filters
  const [status, setStatus] = useState<string>("all");
  const [minScore, setMinScore] = useState<string>("");

  const filtered = useMemo(() => {
    return mockLeads.filter((l) => (status === 'all' ? true : l.outreachStatus === status) && (minScore ? l.leadScore >= Number(minScore) : true));
  }, [status, minScore]);

  const toolbar = (
    <div className="flex items-center gap-2">
      <Select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status" className="w-40">
        <option value="all">All Statuses</option>
        <option value="not_contacted">Not contacted</option>
        <option value="email_sent">Email sent</option>
        <option value="follow_up_sent">Follow-up sent</option>
        <option value="responded">Responded</option>
        <option value="meeting_scheduled">Meeting scheduled</option>
        <option value="converted">Converted</option>
        <option value="not_interested">Not interested</option>
      </Select>
      <Input
        type="number"
        inputMode="numeric"
        placeholder="Min score"
        value={minScore}
        onChange={(e) => setMinScore(e.target.value)}
        className="w-28"
        aria-label="Minimum score"
      />
    </div>
  );

  return (
    <PageContainer>
      <PageHeader title="Leads" />
      <DataTable columns={columns} data={filtered} pageSize={cfg.crm?.defaultPageSize ?? 10} toolbar={toolbar} />
    </PageContainer>
  );
}
