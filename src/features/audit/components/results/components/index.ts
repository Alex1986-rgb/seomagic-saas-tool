
// We'll export components as we create or migrate them
// AuditOptimization удалён: нигде не отрисовывался и считал заявку на счёт
// оплатой («Оплата прошла успешно» и запуск оптимизации без оплаты). Смета и
// запуск живут в InteractiveOptimizationPanel.
export { default as AuditStateHandler } from './AuditStateHandler';
export * from './optimization';

// Export specific optimization types from the centralized system
export type { OptimizationItem } from '@/features/audit/types/optimization-types';
