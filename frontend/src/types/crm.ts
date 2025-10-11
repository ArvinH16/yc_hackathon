import type { AIDetection, Business } from './business';

export type OutreachStatus =
  | 'not_contacted'
  | 'email_sent'
  | 'follow_up_sent'
  | 'responded'
  | 'meeting_scheduled'
  | 'converted'
  | 'not_interested';

export interface Lead {
  businessId: string;
  business?: Business;
  leadScore: number; // 0-100
  aiDetection: AIDetection;
  outreachStatus: OutreachStatus;
  emailsSent: number;
  lastContactDate?: string; // ISO date
  nextFollowUp?: string; // ISO date
  notes: string[];
  assignedTo?: string;
  conversionProbability: number; // 0-1
}

