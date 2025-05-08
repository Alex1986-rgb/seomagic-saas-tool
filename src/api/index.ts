
// Core API client
export * from './client/apiClient';
export * from './client/errorHandler';

// API services - export everything except ScanDetails from seoApiService
export { 
  seoApiService,
  type ApiOptimizationResult 
} from './services/seoApiService';

export { auditDataService } from './services/auditDataService'; 
export * from './services/optimizationService';
export * from './services/firecrawl';

// Export auditApiService
export { auditApiService } from './api/auditApiService';

// Types - export from types/api to avoid conflicts
export * from '../types/api';
