import { motion } from 'framer-motion';
import { Check, Loader2, Circle, Search, Download, Brain, FileText } from 'lucide-react';
import { AuditStage } from './types';
import { Progress } from '@/components/ui/progress';

const STAGE_ICONS = {
  queued: Circle,
  discovery: Search,
  fetching: Download,
  analysis: Brain,
  generating: FileText,
  completed: Check,
};

interface AuditStageIndicatorProps {
  stages: AuditStage[];
  currentStage: string;
}

export const AuditStageIndicator = ({ stages, currentStage }: AuditStageIndicatorProps) => {
  const getIcon = (stage: AuditStage) => {
    const IconComponent = STAGE_ICONS[stage.id] || Circle;
    
    if (stage.status === 'completed') {
      return <Check className="w-5 h-5 text-primary" />;
    }
    if (stage.status === 'active') {
      return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
    }
    return <IconComponent className="w-5 h-5 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      {stages.map((stage, index) => (
        <motion.div
          key={stage.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-3">
            <div className={`
              flex items-center justify-center w-10 h-10 rounded-full 
              ${stage.status === 'active' ? 'bg-primary/20' : 'bg-muted'}
              transition-colors duration-300
            `}>
              {getIcon(stage)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className={`
                  font-medium text-sm
                  ${stage.status === 'active' ? 'text-foreground' : 'text-muted-foreground'}
                `}>
                  {stage.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {stage.progress}%
                </span>
              </div>
              <Progress value={stage.progress} className="h-1.5" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
