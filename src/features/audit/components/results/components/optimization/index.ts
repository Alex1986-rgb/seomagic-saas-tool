
// Основные компоненты
export { default as OptimizationCost } from './OptimizationCost';
export { default as OptimizationHeading } from './OptimizationHeading';
export { default as OptimizationSummary } from './OptimizationSummary';
export { default as OptimizationActions } from './OptimizationActions';
export { default as DemonstrationCost } from './DemonstrationCost';
export { default as CostDetailsTable } from './CostDetailsTable';
export { default as CostSummary } from './CostSummary';
export { default as PaymentDialog } from './PaymentDialog';
export { default as OptimizationPlans } from './OptimizationPlans';
export { default as OptimizationResults } from './OptimizationResults';

// Экспорт типов
export * from './types';
export { 
  calculateTotalCost, 
  generateMockOptimizationItems, 
  generateRandomPageCount,
  generateAuditData
} from './mockOptimizationData';

// Экспортируем компоненты для процесса
export * from './process';
