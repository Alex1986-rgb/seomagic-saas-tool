
import React, { useState } from 'react';
import { Check, Copy, ChevronDown, ChevronUp, Info, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AuditCategoryItemProps {
  id: string;
  title: string;
  description?: string;
  value?: string;
  status: 'good' | 'warning' | 'error';
  trend?: 'up' | 'down' | 'neutral';
  helpText?: string;
}

interface AuditCategorySectionProps {
  title: string;
  score: number;
  items: AuditCategoryItemProps[];
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
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'good': return 'text-green-500 bg-green-50 border-green-200';
      case 'warning': return 'text-amber-500 bg-amber-50 border-amber-200';
      case 'error': return 'text-red-500 bg-red-50 border-red-200';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'good': return '✓';
      case 'warning': return '⚠';
      case 'error': return '✗';
      default: return '•';
    }
  };

  const getTrendIcon = (trend?: string) => {
    if (!trend) return null;
    
    switch(trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-red-500" />;
      case 'neutral': return <Minus className="h-3 w-3 text-amber-500" />;
      default: return null;
    }
  };

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

  // Calculate trend for overall score
  const getScoreTrend = () => {
    if (!previousScore) return undefined;
    
    const diff = score - previousScore;
    if (diff > 3) return 'up';
    if (diff < -3) return 'down';
    return 'neutral';
  };

  const scoreTrend = getScoreTrend();

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
        
        <div className="text-2xl font-bold flex items-center gap-2">
          <span className={score >= 80 ? 'text-green-500' : score >= 60 ? 'text-amber-500' : 'text-red-500'}>
            {score}
          </span>
          <span className="text-muted-foreground">/100</span>
          
          {scoreTrend && (
            <span className={`trend-indicator ${scoreTrend === 'up' ? 'trend-up' : scoreTrend === 'down' ? 'trend-down' : 'trend-neutral'} flex items-center gap-1`}>
              {getTrendIcon(scoreTrend)}
              <span className="text-xs">{scoreTrend === 'up' ? '+' : scoreTrend === 'down' ? '-' : ''}
                {Math.abs(score - (previousScore || 0))}
              </span>
            </span>
          )}
        </div>
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
            {items.map((item) => (
              <motion.div 
                key={item.id} 
                className={`p-4 border rounded-lg transition-all duration-300 hover:shadow-md ${getStatusColor(item.status)}`}
                whileHover={{ y: -2 }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="inline-block w-6 h-6 text-center mr-3">
                      {getStatusIcon(item.status)}
                    </span>
                    <h3 className="font-medium flex items-center">
                      {item.title}
                      {item.trend && (
                        <span className="ml-2">{getTrendIcon(item.trend)}</span>
                      )}
                      
                      {item.helpText && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help ml-1.5" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>{item.helpText}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </h3>
                  </div>
                  {item.value && (
                    <div className="flex items-center gap-2">
                      <div className="font-mono">{item.value}</div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          item.value && handleCopyValue(item.value, item.id);
                        }}
                        className="p-1 rounded hover:bg-background/50"
                      >
                        {copiedId === item.id ? 
                          <Check className="h-4 w-4 text-green-500" /> : 
                          <Copy className="h-4 w-4 text-muted-foreground" />
                        }
                      </button>
                    </div>
                  )}
                </div>
                {item.description && (
                  <p className="mt-2 ml-9 text-sm">{item.description}</p>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AuditCategorySection;
