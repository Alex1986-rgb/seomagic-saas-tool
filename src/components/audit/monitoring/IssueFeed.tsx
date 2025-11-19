import React, { useState, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, AlertTriangle, CheckCircle2, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Issue } from '@/components/audit/realtime/types';

interface IssueFeedProps {
  issues: Issue[];
  onFilter?: (severity: 'error' | 'warning' | 'good' | 'all') => void;
  maxHeight?: string;
}

export const IssueFeed: React.FC<IssueFeedProps> = ({
  issues,
  onFilter,
  maxHeight = '400px',
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'error' | 'warning' | 'good'>('all');

  const filteredIssues = useMemo(() => {
    const filtered = activeFilter === 'all' 
      ? issues 
      : issues.filter((issue) => issue.severity === activeFilter);
    
    // Sort by severity and take last 20
    return filtered
      .sort((a, b) => {
        const severityOrder = { error: 0, warning: 1, good: 2 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      })
      .slice(-20)
      .reverse();
  }, [issues, activeFilter]);

  const counts = useMemo(() => ({
    all: issues.length,
    error: issues.filter((i) => i.severity === 'error').length,
    warning: issues.filter((i) => i.severity === 'warning').length,
    good: issues.filter((i) => i.severity === 'good').length,
  }), [issues]);

  const handleFilterChange = (filter: 'all' | 'error' | 'warning' | 'good') => {
    setActiveFilter(filter);
    onFilter?.(filter);
  };

  const getIcon = (severity: Issue['severity']) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'good':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
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

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Фильтр:</span>
        </div>
        <Button
          variant={activeFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange('all')}
        >
          Все ({counts.all})
        </Button>
        <Button
          variant={activeFilter === 'error' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange('error')}
          className={activeFilter === 'error' ? 'bg-destructive hover:bg-destructive/90' : ''}
        >
          <AlertCircle className="h-3 w-3 mr-1" />
          Ошибки ({counts.error})
        </Button>
        <Button
          variant={activeFilter === 'warning' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange('warning')}
          className={activeFilter === 'warning' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
        >
          <AlertTriangle className="h-3 w-3 mr-1" />
          Предупреждения ({counts.warning})
        </Button>
        <Button
          variant={activeFilter === 'good' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange('good')}
          className={activeFilter === 'good' ? 'bg-green-500 hover:bg-green-600' : ''}
        >
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Пройдено ({counts.good})
        </Button>
      </div>

      {/* Issues List */}
      <ScrollArea style={{ maxHeight }} className="rounded-md border border-border">
        <div className="p-4 space-y-2">
          <AnimatePresence mode="popLayout">
            {filteredIssues.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-muted-foreground py-8"
              >
                {activeFilter === 'all' ? 'Пока нет обнаруженных проблем' : `Нет проблем типа "${activeFilter}"`}
              </motion.div>
            ) : (
              filteredIssues.map((issue, index) => (
                <motion.div
                  key={`${issue.url}-${issue.type}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`p-3 rounded-lg border-l-4 ${getSeverityColor(issue.severity)}`}
                >
                  <div className="flex items-start gap-3">
                    {getIcon(issue.severity)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-medium text-sm">{issue.description}</span>
                        <Badge variant="outline" className="text-xs">
                          {issue.type}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground truncate" title={issue.url}>
                        {issue.url}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(issue.timestamp).toLocaleTimeString('ru-RU')}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
};
