
// Core API client
export * from './client/apiClient';
export * from './client/errorHandler';

// API services
export * from './services/seoApiService';
export * from './services/auditDataService'; 
export * from './services/optimizationService';
export * from './services/firecrawl';

// Export auditApiService
export { auditApiService } from './api/auditApiService';

// Types
export * from '../types/api';
