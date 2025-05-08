
// Core API client
export * from './client/apiClient';
export * from './client/errorHandler';

// API services
export * from './services/seoApiService';
export { auditDataService } from './services/auditDataService'; 
export * from './services/optimizationService';
export * from './services/firecrawl';

// Export auditApiService
export { auditApiService } from './api/auditApiService';

// Types - explicitly re-export types to resolve ambiguity
export * from '../types/api';
