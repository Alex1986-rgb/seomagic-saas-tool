
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import StatusIndicator from './StatusIndicator';

interface AuditCategoryItemProps {
  id: string;
  title: string;
  description: string;
  status: 'good' | 'warning' | 'error';
  value?: number | string;
  trend?: 'up' | 'down' | 'neutral';
  helpText?: string;
  getTrendIcon: (trend?: string) => React.ReactNode;
}

const AuditCategoryItem: React.FC<AuditCategoryItemProps> = ({
  id,
  title,
  description,
  status,
  value,
  trend,
  helpText,
  getTrendIcon
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-lg overflow-hidden">
      <div 
        className="p-4 bg-card flex justify-between items-center cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <StatusIndicator status={status} />
          <h3 className="font-medium">{title}</h3>
          
          {value && (
            <div className="ml-3 flex items-center gap-1 text-sm">
              <span className="text-muted-foreground">
                {typeof value === 'number' ? `${value}%` : value}
              </span>
              {trend && getTrendIcon(trend)}
            </div>
          )}
        </div>
        
        <div className="flex items-center">
          {helpText && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help mr-2" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{helpText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {expanded ? 
            <ChevronUp className="h-5 w-5 text-muted-foreground" /> : 
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          }
        </div>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-4 py-3 bg-card/50 border-t"
          >
            <p className="text-sm text-muted-foreground">{description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuditCategoryItem;
