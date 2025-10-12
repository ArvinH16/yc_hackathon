import type { AgentEvaluationRun } from '@/types/agentEval';

// Mock evaluations for competitors detected as using AI
// Source context: "Bella Beambell Test Set: ymogu0" 5 sims, completed

// Deterministic seeded randomness so values vary per business but remain stable
function hashString(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) + str.charCodeAt(i);
  }
  return h >>> 0;
}
function seededRand(key: string, salt = 0): number {
  let seed = (hashString(key) ^ (salt >>> 0)) >>> 0;
  // LCG parameters
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 0x100000000; // [0,1)
}
function range(min: number, max: number, r: number) {
  return min + (max - min) * r;
}

const baseMetrics = {
  latencyAvgSec: 0.41,
  audioDurationAvgSec: 28,
  interruptionsPerMin: 7.69,
  nonRoboticToneHz: 5.81,
  // success/issue rates are set per-business below via seeded randomness
  callResolutionSuccessRate: undefined,
  conversationProgressionSuccessRate: undefined,
  failsToRespondRate: undefined,
  // Not reported in the sample; leave undefined or 0 as appropriate
  repeatsRate: undefined,
  silentUntilPromptedRate: undefined,
} as const;

export const mockAgentEvaluations: AgentEvaluationRun[] = [
  {
    id: 'eval-bay-beauty-medspa-ymogu0',
    businessName: 'Bay Beauty MedSpa',
    provider: 'Competitor AI',
    testSetName: 'Bella Beambell Test Set: ymogu0',
    jobId: 'buxXcfdhyKtzufnWsTgFFU',
    createdAt: new Date().toISOString(),
    simulationsTotal: 5,
    simulationsCompleted: 5,
    status: 'completed',
    metrics: {
      ...baseMetrics,
      callResolutionSuccessRate: range(0.25, 0.6, seededRand('Bay Beauty MedSpa', 1)),
      conversationProgressionSuccessRate: range(0.3, 0.7, seededRand('Bay Beauty MedSpa', 2)),
      failsToRespondRate: range(0.0, 0.12, seededRand('Bay Beauty MedSpa', 3)),
      repeatsRate: range(0.1, 0.35, seededRand('Bay Beauty MedSpa', 4)),
      silentUntilPromptedRate: range(0.03, 0.22, seededRand('Bay Beauty MedSpa', 5)),
    },
    notes: [
      'Missed pricing follow up on package inquiry',
      'Slow escalation when user requested unique service',
      'Inconsistent booking confirmation path under interruption',
    ],
  },
  {
    id: 'eval-pacific-heights-aesthetics-ymogu0',
    businessName: 'Pacific Heights Aesthetics',
    provider: 'Competitor AI',
    testSetName: 'Bella Beambell Test Set: ymogu0',
    jobId: 'buxXcfdhyKtzufnWsTgFFU',
    createdAt: new Date().toISOString(),
    simulationsTotal: 5,
    simulationsCompleted: 5,
    status: 'completed',
    metrics: {
      ...baseMetrics,
      interruptionsPerMin: 6.8,
      callResolutionSuccessRate: range(0.2, 0.55, seededRand('Pacific Heights Aesthetics', 1)),
      conversationProgressionSuccessRate: range(0.25, 0.65, seededRand('Pacific Heights Aesthetics', 2)),
      failsToRespondRate: range(0.0, 0.1, seededRand('Pacific Heights Aesthetics', 3)),
      repeatsRate: range(0.12, 0.3, seededRand('Pacific Heights Aesthetics', 4)),
      silentUntilPromptedRate: range(0.04, 0.2, seededRand('Pacific Heights Aesthetics', 5)),
    },
    notes: [
      'Hesitation handling last-minute full-day package request',
      'Did not progress conversation toward resolution',
    ],
  },
  {
    id: 'eval-mission-med-aesthetics-ymogu0',
    businessName: 'Mission Med Aesthetics',
    provider: 'Competitor AI',
    testSetName: 'Bella Beambell Test Set: ymogu0',
    jobId: 'buxXcfdhyKtzufnWsTgFFU',
    createdAt: new Date().toISOString(),
    simulationsTotal: 5,
    simulationsCompleted: 5,
    status: 'completed',
    metrics: {
      ...baseMetrics,
      nonRoboticToneHz: 5.4,
      callResolutionSuccessRate: range(0.28, 0.6, seededRand('Mission Med Aesthetics', 1)),
      conversationProgressionSuccessRate: range(0.3, 0.68, seededRand('Mission Med Aesthetics', 2)),
      failsToRespondRate: range(0.0, 0.08, seededRand('Mission Med Aesthetics', 3)),
      repeatsRate: range(0.1, 0.28, seededRand('Mission Med Aesthetics', 4)),
      silentUntilPromptedRate: range(0.03, 0.18, seededRand('Mission Med Aesthetics', 5)),
    },
    notes: [
      'Failed to confirm beautician availability request path',
      'Needs better handling of service not listed on site',
    ],
  },
];

export function findAgentEvaluation(name: string): AgentEvaluationRun | undefined {
  return mockAgentEvaluations.find((r) => r.businessName === name);
}
