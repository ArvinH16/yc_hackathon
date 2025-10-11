import type { Lead } from '@/types/crm';

export const mockLeads: Lead[] = [
  {
    businessId: 'comp-1',
    leadScore: 85,
    aiDetection: { isAI: false, confidence: 0.95, detectionMethod: 'voice_pattern' },
    outreachStatus: 'email_sent',
    emailsSent: 1,
    lastContactDate: '2025-10-10T14:00:00Z',
    nextFollowUp: '2025-10-14T10:00:00Z',
    notes: [
      'High-quality salon using human receptionist',
      'Owner expressed interest in automation during discovery call',
    ],
    assignedTo: 'Ari',
    conversionProbability: 0.72,
  },
  {
    businessId: 'comp-2',
    leadScore: 60,
    aiDetection: { isAI: true, confidence: 0.9, detectionMethod: 'response_time', aiProvider: 'Other' },
    outreachStatus: 'not_contacted',
    emailsSent: 0,
    notes: ['Uses AI but slow responses; potential upgrade angle'],
    conversionProbability: 0.4,
  },
  {
    businessId: 'comp-3',
    leadScore: 70,
    aiDetection: { isAI: false, confidence: 0.7, detectionMethod: 'voice_pattern' },
    outreachStatus: 'follow_up_sent',
    emailsSent: 2,
    notes: ['Interested in voicemail-to-text feature'],
    conversionProbability: 0.55,
  },
];

