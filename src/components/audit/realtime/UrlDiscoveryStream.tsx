import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Link2, FileText, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

interface UrlDiscoveryStreamProps {
  taskId: string;
}

interface DiscoveredUrl {
  url: string;
  timestamp: number;
  source: string;
}

export const UrlDiscoveryStream = ({ taskId }: UrlDiscoveryStreamProps) => {
  const [discoveredUrls, setDiscoveredUrls] = useState<DiscoveredUrl[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentSource, setCurrentSource] = useState<string>('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!taskId) return;

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`audit-task-${taskId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'audit_tasks',
          filter: `id=eq.${taskId}`
        },
        (payload) => {
          const newData = payload.new as any;
          
          // Check if we're still in discovery phase
          if (newData.stage !== 'discovery') {
            setIsActive(false);
            return;
          }

          // Update source
          if (newData.discovery_source) {
            setCurrentSource(newData.discovery_source);
          }

          // Update total count
          if (newData.discovered_urls_count) {
            setTotalCount(newData.discovered_urls_count);
          }

          // Add new discovered URL to the stream
          if (newData.last_discovered_url) {
            setDiscoveredUrls(prev => {
              const newUrl: DiscoveredUrl = {
                url: newData.last_discovered_url,
                timestamp: Date.now(),
                source: newData.discovery_source || 'unknown'
              };
              
              // Keep only last 50 URLs in the stream
              const updated = [newUrl, ...prev].slice(0, 50);
              return updated;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [taskId]);

  const getSourceIcon = (source: string) => {
    if (source.includes('sitemap')) return <FileText className="h-4 w-4" />;
    if (source.includes('page')) return <Link2 className="h-4 w-4" />;
    return <Search className="h-4 w-4" />;
  };

  const getSourceLabel = (source: string) => {
    if (source.includes('sitemap')) return 'Sitemap';
    if (source.includes('page')) return 'Страница';
    return 'Поиск';
  };

  if (!isActive && discoveredUrls.length === 0) {
    return null;
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            {isActive && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
            <Search className="h-5 w-5 text-primary" />
            Обнаружение URL
          </CardTitle>
          <Badge variant="secondary" className="text-sm font-mono">
            {totalCount} URL
          </Badge>
        </div>
        {currentSource && (
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            {getSourceIcon(currentSource)}
            <span>Источник: {getSourceLabel(currentSource)}</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <AnimatePresence mode="popLayout">
            {discoveredUrls.map((item, index) => (
              <motion.div
                key={`${item.url}-${item.timestamp}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="mb-2 p-3 rounded-lg bg-muted/50 border border-border/50 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getSourceIcon(item.source)}
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                      >
                        {getSourceLabel(item.source)}
                      </Badge>
                    </div>
                    <p className="text-sm font-mono text-foreground/80 truncate" title={item.url}>
                      {item.url}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    #{totalCount - index}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {discoveredUrls.length === 0 && isActive && (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-sm">Начинаем поиск URL...</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
