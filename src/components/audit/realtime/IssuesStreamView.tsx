import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Issue } from './types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface IssuesStreamViewProps {
  issues: Issue[];
}

export const IssuesStreamView = ({ issues }: IssuesStreamViewProps) => {
  const getIcon = (severity: Issue['severity']) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'good':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    }
  };

  const getSeverityColor = (severity: Issue['severity']) => {
    switch (severity) {
      case 'error':
        return 'border-l-destructive bg-destructive/5';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-500/5';
      case 'good':
        return 'border-l-green-500 bg-green-500/5';
    }
  };

  // Группируем по severity и берем последние 20
  const sortedIssues = [...issues]
    .sort((a, b) => {
      const severityOrder = { error: 0, warning: 1, good: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    })
    .slice(-20);

  return (
    <ScrollArea className="h-[400px] rounded-lg border bg-card">
      <div className="p-4 space-y-2">
        <AnimatePresence mode="popLayout">
          {sortedIssues.map((issue, index) => (
            <motion.div
              key={`${issue.url}-${issue.type}-${index}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`
                p-3 rounded-lg border-l-4
                ${getSeverityColor(issue.severity)}
              `}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getIcon(issue.severity)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-1">
                    {issue.description}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {issue.url}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(issue.timestamp).toLocaleTimeString('ru-RU')}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ScrollArea>
  );
};
