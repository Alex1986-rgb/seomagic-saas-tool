import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import CostSummary from './CostSummary';
import CostDetailsTable from './CostDetailsTable';
import OptimizationActions from './OptimizationActions';
import OptimizationHeading from './OptimizationHeading';
import OptimizationSummary from './OptimizationSummary';
import { OptimizationItem } from '@/features/audit/types/optimization-types';

interface OptimizationCostProps {
  optimizationCost?: number;
  pageCount: number;
  url: string;
  onDownloadOptimized?: () => void;
  isOptimized?: boolean;
  className?: string;
  optimizationItems?: OptimizationItem[];
  onGeneratePdfReport?: () => void;
  onSelectPrompt?: (prompt: string) => void;
}

/**
 * Смета без запуска.
 *
 * Здесь жила имитация: после «Оплата успешно произведена» полоса ползла
 * случайными шагами, а в конце показывался вписанный в код результат «было 65 →
 * стало 92» с выдуманной страницей. Ни оплаты, ни работы за этим не было.
 * У этого блока нет аудита, по которому можно запустить настоящую
 * оптимизацию, поэтому он только показывает смету и принимает заявку на счёт.
 * Запуск — в AuditOptimizationSection и InteractiveOptimizationPanel.
 */
const OptimizationCost: React.FC<OptimizationCostProps> = ({
  optimizationCost,
  pageCount,
  url,
  onDownloadOptimized,
  isOptimized = false,
  className,
  optimizationItems = [],
  onGeneratePdfReport,
  onSelectPrompt
}) => {
  const { toast } = useToast();
  const [isInvoiceRequested, setIsInvoiceRequested] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSelectPrompt = (prompt: string) => {
    if (onSelectPrompt) {
      onSelectPrompt(prompt);
    }

    toast({
      title: "Шаблон выбран",
      description: "Текст шаблона добавлен в пожелания к оптимизации",
    });
  };

  if (!optimizationCost) return null;

  return (
    <motion.div
      className={`border border-primary/20 rounded-lg p-4 bg-card/50 ${className || ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <OptimizationHeading />

      <CostSummary pageCount={pageCount} optimizationCost={optimizationCost} />

      <CostDetailsTable items={optimizationItems} />

      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <OptimizationSummary url={url} />

        <OptimizationActions
          url={url}
          optimizationCost={optimizationCost}
          isOptimized={isOptimized}
          isInvoiceRequested={isInvoiceRequested}
          onDownloadOptimized={onDownloadOptimized}
          onGeneratePdfReport={onGeneratePdfReport}
          onInvoiceRequested={() => setIsInvoiceRequested(true)}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          onSelectPrompt={handleSelectPrompt}
        />
      </div>
    </motion.div>
  );
};

export default OptimizationCost;
