"use client";

import type { AgentEvaluationRun } from '@/types/agentEval';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function PercentBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
  return (
    <div className="h-2 w-full rounded bg-muted">
      <div
        className="h-2 rounded bg-green-500"
        style={{ width: `${pct}%` }}
        aria-label={`Percent ${pct}%`}
      />
    </div>
  );
}

export function AgentEvaluationCard({ run }: { run: AgentEvaluationRun }) {
  const m = run.metrics;
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Agent Evaluation</CardTitle>
        <CardDescription>
          {run.provider ? `${run.provider} — ` : ''}{run.testSetName} • {run.simulationsCompleted}/{run.simulationsTotal} simulations • {new Date(run.createdAt).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <div>
            <div className="text-xs text-muted-foreground">Latency</div>
            <div className="font-medium">{Math.round(m.latencyAvgSec * 1000)} ms</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Audio Duration</div>
            <div className="font-medium">{Math.round(m.audioDurationAvgSec)} s</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Interruptions</div>
            <div className="font-medium">{m.interruptionsPerMin.toFixed(2)}/min</div>
          </div>
          {typeof m.nonRoboticToneHz === 'number' && (
            <div>
              <div className="text-xs text-muted-foreground">Non Robotic Tone</div>
              <div className="font-medium">{m.nonRoboticToneHz.toFixed(2)} Hz</div>
            </div>
          )}
          <div className="col-span-2 md:col-span-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Call Resolution Success</div>
              <Badge variant={m.callResolutionSuccessRate && m.callResolutionSuccessRate > 0.5 ? 'default' : 'secondary'}>
                {Math.round((m.callResolutionSuccessRate ?? 0) * 100)}%
              </Badge>
            </div>
            <PercentBar value={m.callResolutionSuccessRate ?? 0} />
          </div>
          <div className="col-span-2 md:col-span-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Conversation Progression</div>
              <Badge variant={m.conversationProgressionSuccessRate && m.conversationProgressionSuccessRate > 0.5 ? 'default' : 'secondary'}>
                {Math.round((m.conversationProgressionSuccessRate ?? 0) * 100)}%
              </Badge>
            </div>
            <PercentBar value={m.conversationProgressionSuccessRate ?? 0} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {typeof m.failsToRespondRate === 'number' && (
            <Badge variant={m.failsToRespondRate > 0.1 ? 'destructive' : 'secondary'}>
              Fails to Respond: {Math.round(m.failsToRespondRate * 100)}%
            </Badge>
          )}
          {typeof m.repeatsRate === 'number' && (
            <Badge variant={m.repeatsRate > 0.2 ? 'destructive' : 'secondary'}>
              Repeats: {Math.round(m.repeatsRate * 100)}%
            </Badge>
          )}
          {typeof m.silentUntilPromptedRate === 'number' && (
            <Badge variant={m.silentUntilPromptedRate > 0.2 ? 'destructive' : 'secondary'}>
              Silent Until Prompted: {Math.round(m.silentUntilPromptedRate * 100)}%
            </Badge>
          )}
        </div>

        {run.notes && run.notes.length > 0 && (
          <div>
            <div className="mb-1 font-medium">Notes</div>
            <ul className="list-disc pl-5">
              {run.notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </div>
        )}
        {/* Subtle credit */}
        <div className="pt-2 text-right text-[11px] text-muted-foreground">Powered by Coval</div>
      </CardContent>
    </Card>
  );
}
