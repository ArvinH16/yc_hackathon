export interface CallTranscript {
  id: string;
  businessName: string;
  timestamp: string; // ISO date
  duration: number; // seconds
  transcript: string;
  sentimentScore?: number; // -1 to 1
  keyInsights: string[];
  questionsAsked: string[];
  answersReceived: string[];
}
