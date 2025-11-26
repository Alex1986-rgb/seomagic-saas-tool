
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  ChevronUp, 
  Info, 
  AlertTriangle, 
  XCircle, 
  Copy, 
  Check,
  Filter
} from 'lucide-react';
import { ScanLogEntry, ScanLogLevel } from '@/types/scan-logs';
import { cn } from '@/lib/utils';

interface ScanErrorLogProps {
  logs: ScanLogEntry[];
  onClearLogs?: () => void;
}

const levelConfig: Record<ScanLogLevel, { icon: React.ElementType; color: string; bgColor: string }> = {
  info: { icon: Info, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  warning: { icon: AlertTriangle, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
  error: { icon: XCircle, color: 'text-destructive', bgColor: 'bg-destructive/10' },
};

const ScanErrorLog: React.FC<ScanErrorLogProps> = ({ logs, onClearLogs }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<ScanLogLevel | 'all'>('all');
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredLogs = logs.filter(log => 
    filter === 'all' || log.level === filter
  );

  const errorCount = logs.filter(l => l.level === 'error').length;
  const warningCount = logs.filter(l => l.level === 'warning').length;

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (scrollRef.current && isOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isOpen]);

  // Auto-open if there are errors
  useEffect(() => {
    if (errorCount > 0 && !isOpen) {
      setIsOpen(true);
    }
  }, [errorCount]);

  const handleCopyLogs = async () => {
    const logText = logs.map(log => 
      `[${log.timestamp.toISOString()}] [${log.level.toUpperCase()}] [${log.stage}] ${log.message}${log.details ? `\n  Details: ${log.details}` : ''}${log.url ? `\n  URL: ${log.url}` : ''}`
    ).join('\n');
    
    await navigator.clipboard.writeText(logText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  if (logs.length === 0) return null;

  return (
    <Card className="bg-card/90 backdrop-blur-sm border-border">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Лог сканирования
                <Badge variant="secondary" className="ml-2">
                  {logs.length}
                </Badge>
                {errorCount > 0 && (
                  <Badge variant="destructive">
                    {errorCount} ошибок
                  </Badge>
                )}
                {warningCount > 0 && (
                  <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
                    {warningCount} предупреждений
                  </Badge>
                )}
              </CardTitle>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            {/* Filters and actions */}
            <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
              <div className="flex gap-1">
                {(['all', 'info', 'warning', 'error'] as const).map((level) => (
                  <Button
                    key={level}
                    variant={filter === level ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(level)}
                    className="h-7 text-xs"
                  >
                    {level === 'all' ? 'Все' : level === 'info' ? 'Инфо' : level === 'warning' ? 'Предупреждения' : 'Ошибки'}
                  </Button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLogs}
                  className="h-7 text-xs"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      Скопировано
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Копировать
                    </>
                  )}
                </Button>
                {onClearLogs && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearLogs}
                    className="h-7 text-xs text-muted-foreground"
                  >
                    Очистить
                  </Button>
                )}
              </div>
            </div>

            {/* Log entries */}
            <ScrollArea className="h-[200px] rounded-md border bg-muted/30" ref={scrollRef}>
              <div className="p-2 space-y-1">
                {filteredLogs.length === 0 ? (
                  <p className="text-center text-muted-foreground text-sm py-4">
                    Нет записей для выбранного фильтра
                  </p>
                ) : (
                  filteredLogs.map((log) => {
                    const config = levelConfig[log.level];
                    const Icon = config.icon;
                    
                    return (
                      <div
                        key={log.id}
                        className={cn(
                          "flex items-start gap-2 p-2 rounded text-xs",
                          config.bgColor
                        )}
                      >
                        <Icon className={cn("h-3.5 w-3.5 mt-0.5 shrink-0", config.color)} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-muted-foreground font-mono">
                              {formatTime(log.timestamp)}
                            </span>
                            <Badge variant="outline" className="h-4 text-[10px] px-1">
                              {log.stage}
                            </Badge>
                          </div>
                          <p className={cn("mt-0.5", config.color)}>
                            {log.message}
                          </p>
                          {log.details && (
                            <p className="text-muted-foreground mt-0.5 break-all">
                              {log.details}
                            </p>
                          )}
                          {log.url && (
                            <p className="text-muted-foreground mt-0.5 truncate">
                              URL: {log.url}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default ScanErrorLog;
