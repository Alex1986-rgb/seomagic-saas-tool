import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { IssueItem } from './types';

interface TopIssuesPanelProps {
  issues: IssueItem[];
}

const TopIssuesPanel: React.FC<TopIssuesPanelProps> = ({ issues }) => {
  const [expandedSeverity, setExpandedSeverity] = useState<string | null>('error');

  const groupedIssues = {
    error: issues.filter(i => i.severity === 'error'),
    warning: issues.filter(i => i.severity === 'warning'),
    good: issues.filter(i => i.severity === 'good')
  };

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'error':
        return {
          label: 'Критические',
          icon: AlertCircle,
          color: 'destructive',
          bgColor: 'bg-destructive/10',
          textColor: 'text-destructive'
        };
      case 'warning':
        return {
          label: 'Предупреждения',
          icon: AlertTriangle,
          color: 'warning',
          bgColor: 'bg-warning/10',
          textColor: 'text-warning'
        };
      case 'good':
        return {
          label: 'Пройдено',
          icon: CheckCircle2,
          color: 'success',
          bgColor: 'bg-success/10',
          textColor: 'text-success'
        };
      default:
        return {
          label: '',
          icon: AlertCircle,
          color: 'secondary',
          bgColor: 'bg-secondary/10',
          textColor: 'text-secondary'
        };
    }
  };

  const toggleSeverity = (severity: string) => {
    setExpandedSeverity(expandedSeverity === severity ? null : severity);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <Card className="backdrop-blur-sm bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>Топ проблем</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(['error', 'warning', 'good'] as const).map((severity) => {
            const config = getSeverityConfig(severity);
            const Icon = config.icon;
            const severityIssues = groupedIssues[severity];
            const isExpanded = expandedSeverity === severity;

            if (severityIssues.length === 0) return null;

            return (
              <div key={severity} className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto"
                  onClick={() => toggleSeverity(severity)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${config.bgColor}`}>
                      <Icon className={`h-5 w-5 ${config.textColor}`} />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{config.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {severityIssues.length} {severityIssues.length === 1 ? 'проблема' : 'проблем'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={config.color as any}>{severityIssues.length}</Badge>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </Button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-2 pl-4">
                        {severityIssues.slice(0, 5).map((issue, index) => (
                          <motion.div
                            key={issue.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-3 rounded-lg border border-border/50 bg-background/50"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="font-medium text-sm">{issue.title}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {issue.description}
                                </div>
                                {issue.affectedPages.length > 0 && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    Затронуто страниц: {issue.affectedPages.length}
                                  </div>
                                )}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {issue.category}
                              </Badge>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TopIssuesPanel;
