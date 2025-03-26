
import React, { useState } from 'react';
import { Copy, Check, Info } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { StatusIndicator } from './';

interface AuditCategoryItemProps {
  id: string;
  title: string;
  description?: string;
  value?: string;
  status: 'good' | 'warning' | 'error';
  trend?: 'up' | 'down' | 'neutral';
  helpText?: string;
  getTrendIcon: (trend?: string) => React.ReactNode;
}

const AuditCategoryItem: React.FC<AuditCategoryItemProps> = ({
  id,
  title,
  description,
  value,
  status,
  trend,
  helpText,
  getTrendIcon
}) => {
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyValue = (value: string, id: string) => {
    navigator.clipboard.writeText(value);
    setCopiedId(id);
    toast({
      title: "Значение скопировано",
      description: "Значение скопировано в буфер обмена",
    });
    
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'good': return 'text-green-500 bg-green-50 border-green-200';
      case 'warning': return 'text-amber-500 bg-amber-50 border-amber-200';
      case 'error': return 'text-red-500 bg-red-50 border-red-200';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <motion.div 
      key={id} 
      className={`p-4 border rounded-lg transition-all duration-300 hover:shadow-md ${getStatusColor(status)}`}
      whileHover={{ y: -2 }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <StatusIndicator status={status} />
          <h3 className="font-medium flex items-center">
            {title}
            {trend && (
              <span className="ml-2">{getTrendIcon(trend)}</span>
            )}
            
            {helpText && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help ml-1.5" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{helpText}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </h3>
        </div>
        {value && (
          <div className="flex items-center gap-2">
            <div className="font-mono">{value}</div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                value && handleCopyValue(value, id);
              }}
              className="p-1 rounded hover:bg-background/50"
            >
              {copiedId === id ? 
                <Check className="h-4 w-4 text-green-500" /> : 
                <Copy className="h-4 w-4 text-muted-foreground" />
              }
            </button>
          </div>
        )}
      </div>
      {description && (
        <p className="mt-2 ml-9 text-sm">{description}</p>
      )}
    </motion.div>
  );
};

export default AuditCategoryItem;
