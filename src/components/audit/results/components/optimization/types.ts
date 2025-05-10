
import { 
  OptimizationItem, 
  OptimizationResults, 
  OptimizationProgressState 
} from '@/features/audit/types/optimization-types';

export type { OptimizationItem, OptimizationResults, OptimizationProgressState };

export interface CostDetailsTableProps {
  items: OptimizationItem[];
  className?: string;
}
