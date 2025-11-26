
export interface ScanLogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error';
  stage: string;
  message: string;
  details?: string;
  url?: string;
}

export type ScanLogLevel = ScanLogEntry['level'];
