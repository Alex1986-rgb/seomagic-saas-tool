
import React, { useState } from 'react';
import { Check, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from 'framer-motion';

interface AuditCategoryItemProps {
  id: string;
  title: string;
  description?: string;
  value?: string;
  status: 'good' | 'warning' | 'error';
}

interface AuditCategorySectionProps {
  title: string;
  score: number;
  items: AuditCategoryItemProps[];
  description?: string;
}

const AuditCategorySection: React.FC<AuditCategorySectionProps> = ({
  title,
  score,
  items,
  description,
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
          </h2>
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
        <div className="text-2xl font-bold">
          <span className={score >= 80 ? 'text-green-500' : score >= 60 ? 'text-amber-500' : 'text-red-500'}>
            {score}
          </span>
          <span className="text-muted-foreground">/100</span>
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
                    <h3 className="font-medium">{item.title}</h3>
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
