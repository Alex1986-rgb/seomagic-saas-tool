
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Activity, BarChart3, AlertTriangle, Download } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useSimpleSitemapCreator } from '../hooks/useSimpleSitemapCreator';
import { saveAs } from 'file-saver';

interface SiteStructureAnalysisProps {
  domain: string;
  urls: string[];
}

const SiteStructureAnalysis: React.FC<SiteStructureAnalysisProps> = ({ 
  domain, 
  urls 
}) => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [urlPatterns, setUrlPatterns] = useState<{pattern: string; count: number; urls: string[]}[]>([]);
  const [depthData, setDepthData] = useState<{depth: number; count: number}[]>([]);
  const [domainStructure, setDomainStructure] = useState<{segment: string; count: number}[]>([]);

  const analyzeStructure = async () => {
    if (urls.length === 0) {
      toast({
        title: "Нет данных",
        description: "Сначала выполните сканирование сайта для анализа структуры",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Extract patterns from URLs
      const patterns: Map<string, string[]> = new Map();
      const depthCounts: Map<number, number> = new Map();
      const segmentCounts: Map<string, number> = new Map();
      
      for (const url of urls) {
        try {
          const urlObj = new URL(url);
          
          // Skip if not from the same domain
          if (!urlObj.hostname.includes(domain)) continue;
          
          // Count by path depth
          const pathSegments = urlObj.pathname.split('/').filter(Boolean);
          const depth = pathSegments.length;
          depthCounts.set(depth, (depthCounts.get(depth) || 0) + 1);
          
          // Count segments at each level
          if (pathSegments.length > 0) {
            const firstSegment = pathSegments[0];
            segmentCounts.set(firstSegment, (segmentCounts.get(firstSegment) || 0) + 1);
          }
          
          // Generate a pattern by replacing dynamic parts with placeholders
          let pattern = urlObj.pathname;
          
          // Replace likely IDs with {id}
          pattern = pattern.replace(/\/\d+\/?/g, '/{id}/');
          
          // Replace UUIDs with {uuid}
          pattern = pattern.replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/?/gi, '/{uuid}/');
          
          // Replace slugs with {slug}
          pattern = pattern.replace(/\/[a-z0-9-_]+\/?/gi, '/{slug}/');
          
          // Add to patterns map
          if (!patterns.has(pattern)) {
            patterns.set(pattern, []);
          }
          patterns.get(pattern)!.push(url);
        } catch (error) {
          console.warn(`Error analyzing URL: ${url}`, error);
        }
      }
      
      // Convert maps to arrays and sort
      const patternArray = Array.from(patterns.entries())
        .map(([pattern, urls]) => ({ pattern, count: urls.length, urls }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20); // Take top 20 patterns
      
      const depthArray = Array.from(depthCounts.entries())
        .map(([depth, count]) => ({ depth, count }))
        .sort((a, b) => a.depth - b.depth);
      
      const segmentArray = Array.from(segmentCounts.entries())
        .map(([segment, count]) => ({ segment, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15); // Take top 15 segments
      
      setUrlPatterns(patternArray);
      setDepthData(depthArray);
      setDomainStructure(segmentArray);
      
      toast({
        title: "Анализ завершен",
        description: `Проанализировано ${urls.length} URL-адресов, найдено ${patterns.size} шаблонов`
      });
    } catch (error) {
      console.error('Error analyzing site structure:', error);
      toast({
        title: "Ошибка анализа",
        description: "Произошла ошибка при анализе структуры сайта",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Auto-analyze if we already have URLs
  useEffect(() => {
    if (urls.length > 0 && urlPatterns.length === 0) {
      analyzeStructure();
    }
  }, [urls]);

  // Download analysis as JSON
  const downloadAnalysis = () => {
    const analysisData = {
      domain,
      urlCount: urls.length,
      patterns: urlPatterns,
      depthDistribution: depthData,
      topSections: domainStructure,
      analyzedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(analysisData, null, 2)], { type: 'application/json' });
    const fileName = `site-structure-${domain.replace(/\./g, '_')}.json`;
    
    // Use FileSaver to download
    saveAs(blob, fileName);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Анализ структуры сайта</h3>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={analyzeStructure}
            disabled={isAnalyzing || urls.length === 0}
          >
            <Activity className="mr-2 h-4 w-4" />
            {isAnalyzing ? 'Анализ...' : 'Проанализировать'}
          </Button>
          
          {urlPatterns.length > 0 && (
            <Button 
              variant="outline"
              size="sm"
              onClick={downloadAnalysis}
            >
              <Download className="mr-2 h-4 w-4" />
              Скачать анализ
            </Button>
          )}
        </div>
      </div>
      
      {urls.length === 0 ? (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Сначала необходимо выполнить сканирование сайта для анализа структуры
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* URL Depth Distribution */}
          <Card className="p-4">
            <h4 className="text-sm font-medium mb-2">Распределение по глубине</h4>
            <div className="h-64 flex items-end justify-between gap-1">
              {depthData.map(({ depth, count }) => (
                <div key={depth} className="relative flex flex-col items-center group">
                  <div
                    className="bg-primary/80 hover:bg-primary rounded w-8"
                    style={{ 
                      height: `${Math.max(20, Math.min(100, (count / Math.max(...depthData.map(d => d.count))) * 100))}%` 
                    }}
                  ></div>
                  <span className="text-xs mt-1">{depth}</span>
                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-background px-2 py-1 rounded shadow-sm text-xs whitespace-nowrap">
                    Глубина {depth}: {count} URL ({Math.round((count / urls.length) * 100)}%)
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Распределение URL по уровням вложенности (число сегментов в пути)
            </p>
          </Card>
          
          {/* Top Sections */}
          <Card className="p-4">
            <h4 className="text-sm font-medium mb-2">Основные разделы сайта</h4>
            <div className="space-y-2">
              {domainStructure.slice(0, 10).map(({ segment, count }) => (
                <div key={segment} className="flex items-center gap-2">
                  <div className="flex-grow">
                    <div className="text-sm">{segment || '/'}</div>
                    <div 
                      className="h-2 bg-primary/80 rounded-full mt-1"
                      style={{ 
                        width: `${Math.max(5, Math.min(100, (count / Math.max(...domainStructure.map(d => d.count))) * 100))}%` 
                      }}
                    ></div>
                  </div>
                  <div className="text-sm whitespace-nowrap">
                    {count} URL
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Популярность основных разделов сайта (первый сегмент пути)
            </p>
          </Card>
          
          {/* URL Patterns */}
          <Card className="p-4 md:col-span-2">
            <h4 className="text-sm font-medium mb-2">Шаблоны URL</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 font-medium">Шаблон</th>
                    <th className="text-right py-2 px-3 font-medium">Количество URL</th>
                    <th className="text-right py-2 px-3 font-medium">Процент</th>
                  </tr>
                </thead>
                <tbody>
                  {urlPatterns.slice(0, 10).map(({ pattern, count }, index) => (
                    <tr key={index} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-2 px-3 font-mono text-xs">{pattern || '/'}</td>
                      <td className="py-2 px-3 text-right">{count}</td>
                      <td className="py-2 px-3 text-right">{Math.round((count / urls.length) * 100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Часто встречающиеся шаблоны URL на сайте
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SiteStructureAnalysis;
