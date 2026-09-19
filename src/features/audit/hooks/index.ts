
// Export hooks that we've implemented
export { useAuditBase } from './useAuditBase';
export { useAuditData } from './useAuditData';
export { useAuditActions } from './useAuditActions';
export { useAuditInitialization } from './useAuditInitialization';
export { usePromptToggle } from './usePromptToggle';
export { useAuditExports } from './useAuditExports';
export { useOptimization } from './useOptimization';
export { useAuditLoader } from './useAuditLoader';
export { useScanAPI } from './useScanAPI';
export { usePageAnalysis } from './usePageAnalysis';
export { useSiteAnalysis } from './useSiteAnalysis';
export { useDownloadAPI } from './useDownloadAPI';
// useOptimizationAPI отсюда удалён: нигде не использовался и вместо сметы по
// аудиту подставлял стандартный набор работ («примерная стоимость»). Настоящий
// расчёт — hooks/use-optimization-api.ts (функция optimization-calculate).
export { usePdfReport } from './usePdfReport';
