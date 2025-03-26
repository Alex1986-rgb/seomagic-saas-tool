
export * from './generators';
export * from './recommendations';
export * from './history';
export * from './scanner';
export * from './seoDetails';

import { AuditData } from "@/types/audit";
import { generateAuditData } from './generators';

/**
 * Fetches audit data for a URL
 */
export const fetchAuditData = async (url?: string): Promise<AuditData> => {
  // Simulate an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateAuditData(url || "example.com"));
    }, 1000);
  });
};
