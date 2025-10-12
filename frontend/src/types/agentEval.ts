export interface AgentEvaluationMetrics {
  latencyAvgSec: number; // average across simulations
  audioDurationAvgSec: number; // average across simulations
  interruptionsPerMin: number;
  nonRoboticToneHz?: number;
  callResolutionSuccessRate?: number; // 0-1
  conversationProgressionSuccessRate?: number; // 0-1
  failsToRespondRate?: number; // 0-1
  repeatsRate?: number; // 0-1
  silentUntilPromptedRate?: number; // 0-1
}

export interface AgentEvaluationRun {
  id: string;
  businessName: string;
  provider?: string; // Competitor provider if known
  testSetName: string;
  jobId?: string;
  createdAt: string; // ISO time
  simulationsTotal: number;
  simulationsCompleted: number;
  status: 'queued' | 'running' | 'completed' | 'failed';
  metrics: AgentEvaluationMetrics;
  notes?: string[];
}

