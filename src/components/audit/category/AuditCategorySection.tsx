
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AuditCategoryItem, ScoreBadge } from './';
import { AuditItemData } from '@/types/audit';

interface AuditCategorySectionProps {
  title: string;
  score: number;
  items: AuditItemData[];
  description?: string;
  previousScore?: number;
}

const AuditCategorySection: React.FC<AuditCategorySectionProps> = ({
  title,
  score,
  items,
  description,
  previousScore,
}) => {
  const [expanded, setExpanded] = useState(true);

  const getTrendIcon = (trend?: string) => {
    if (!trend) return null;
    
    switch(trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-red-500" />;
      case 'neutral': return <Minus className="h-3 w-3 text-amber-500" />;
      default: return null;
    }
  };

  return (
    <motion.div 
      className="mb-8 neo-card p-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div 
        className="flex justify-between items-center mb-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            {title}
            {expanded ? 
              <ChevronUp className="h-5 w-5 text-muted-foreground" /> : 
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            }
            
            {description && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help ml-1" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </h2>
        </div>
        
        <ScoreBadge score={score} previousScore={previousScore} />
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div 
            className="space-y-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {items.map((item) => {
              // Convert 'same' to 'neutral' for trend value if needed
              const normalizedTrend = item.trend === 'same' || item.trend === 'neutral' ? 'neutral' : item.trend;
              
              return (
                <AuditCategoryItem 
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  description={item.description}
                  value={item.value}
                  status={item.status}
                  trend={normalizedTrend}
                  helpText={item.helpText}
                  getTrendIcon={getTrendIcon}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AuditCategorySection;
