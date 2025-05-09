
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileText, BarChart2, FileDown, RefreshCw } from "lucide-react";
import AuditOverview from './AuditOverview';
import AuditReports from './AuditReports';
import AuditIssues from './AuditIssues';

interface SiteAuditContentProps {
  url: string;
}

const SiteAuditContent: React.FC<SiteAuditContentProps> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [auditData, setAuditData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  console.log("SiteAuditContent rendering for URL:", url);

  useEffect(() => {
    const loadAuditData = async () => {
      console.log("Loading audit data for:", url);
      setIsLoading(true);
      
      try {
        // Simulate API call to get audit data
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Create mock data
        const mockAuditData = {
          url: url,
          score: Math.floor(Math.random() * 30) + 60,
          date: new Date().toISOString(),
          pageCount: Math.floor(Math.random() * 50) + 10,
          issues: {
            critical: Array(Math.floor(Math.random() * 5) + 1).fill(null).map((_, i) => ({
              id: `c-${i}`,
              title: `Критическая проблема ${i+1}`,
              description: 'Описание критической проблемы с сайтом, требующей немедленного внимания',
              impact: 'high'
            })),
            important: Array(Math.floor(Math.random() * 8) + 3).fill(null).map((_, i) => ({
              id: `i-${i}`,
              title: `Важная проблема ${i+1}`,
              description: 'Описание важной проблемы, которую следует исправить',
              impact: 'medium'
            })),
            opportunities: Array(Math.floor(Math.random() * 10) + 5).fill(null).map((_, i) => ({
              id: `o-${i}`,
              title: `Возможность улучшения ${i+1}`,
              description: 'Описание возможности улучшения показателей сайта',
              impact: 'low'
            })),
            minor: Array(Math.floor(Math.random() * 5)).fill(null).map((_, i) => ({
              id: `m-${i}`,
              title: `Незначительная проблема ${i+1}`,
              description: 'Описание незначительной проблемы',
              impact: 'info'
            })),
            passed: Array(Math.floor(Math.random() * 15) + 10).fill(null).map((_, i) => ({
              id: `p-${i}`,
              title: `Успешная проверка ${i+1}`,
              description: 'Этот аспект сайта соответствует рекомендациям'
            }))
          },
          details: {
            performance: {
              score: Math.floor(Math.random() * 30) + 60,
              metrics: {
                loadingTime: (Math.random() * 3 + 1).toFixed(2),
                firstContentfulPaint: (Math.random() * 1 + 0.5).toFixed(2)
              }
            },
            seo: {
              score: Math.floor(Math.random() * 30) + 60,
              metrics: {
                titleLength: Math.floor(Math.random() * 20) + 40,
                descriptionLength: Math.floor(Math.random() * 50) + 100
              }
            },
            technical: {
              score: Math.floor(Math.random() * 30) + 60,
              metrics: {
                mobileFriendly: Math.random() > 0.3,
                httpsEnabled: Math.random() > 0.2
              }
            }
          }
        };
        
        console.log("Audit data loaded successfully");
        setAuditData(mockAuditData);
        
      } catch (error) {
        console.error("Error loading audit data:", error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить данные аудита",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAuditData();
  }, [url, toast]);
  
  const handleRefresh = () => {
    toast({
      title: "Обновление аудита",
      description: "Запущен новый аудит сайта",
    });
    setAuditData(null);
    setIsLoading(true);
    
    // Re-trigger the useEffect
    setTimeout(() => {
      const loadAuditData = async () => {
        try {
          // Simulate API call to get audit data
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Create mock data similar to the one above
          const mockAuditData = {
            url: url,
            score: Math.floor(Math.random() * 30) + 60,
            date: new Date().toISOString(),
            pageCount: Math.floor(Math.random() * 50) + 10,
            issues: {
              critical: Array(Math.floor(Math.random() * 5) + 1).fill(null).map((_, i) => ({
                id: `c-${i}`,
                title: `Критическая проблема ${i+1}`,
                description: 'Описание критической проблемы с сайтом, требующей немедленного внимания',
                impact: 'high'
              })),
              important: Array(Math.floor(Math.random() * 8) + 3).fill(null).map((_, i) => ({
                id: `i-${i}`,
                title: `Важная проблема ${i+1}`,
                description: 'Описание важной проблемы, которую следует исправить',
                impact: 'medium'
              })),
              opportunities: Array(Math.floor(Math.random() * 10) + 5).fill(null).map((_, i) => ({
                id: `o-${i}`,
                title: `Возможность улучшения ${i+1}`,
                description: 'Описание возможности улучшения показателей сайта',
                impact: 'low'
              })),
              minor: Array(Math.floor(Math.random() * 5)).fill(null).map((_, i) => ({
                id: `m-${i}`,
                title: `Незначительная проблема ${i+1}`,
                description: 'Описание незначительной проблемы',
                impact: 'info'
              })),
              passed: Array(Math.floor(Math.random() * 15) + 10).fill(null).map((_, i) => ({
                id: `p-${i}`,
                title: `Успешная проверка ${i+1}`,
                description: 'Этот аспект сайта соответствует рекомендациям'
              }))
            },
            details: {
              performance: {
                score: Math.floor(Math.random() * 30) + 60,
                metrics: {
                  loadingTime: (Math.random() * 3 + 1).toFixed(2),
                  firstContentfulPaint: (Math.random() * 1 + 0.5).toFixed(2)
                }
              },
              seo: {
                score: Math.floor(Math.random() * 30) + 60,
                metrics: {
                  titleLength: Math.floor(Math.random() * 20) + 40,
                  descriptionLength: Math.floor(Math.random() * 50) + 100
                }
              },
              technical: {
                score: Math.floor(Math.random() * 30) + 60,
                metrics: {
                  mobileFriendly: Math.random() > 0.3,
                  httpsEnabled: Math.random() > 0.2
                }
              }
            }
          };
          
          console.log("Refreshed audit data loaded successfully");
          setAuditData(mockAuditData);
          
        } catch (error) {
          console.error("Error loading audit data:", error);
          toast({
            title: "Ошибка",
            description: "Не удалось обновить данные аудита",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      loadAuditData();
    }, 100);
  };
  
  const handleDownloadReport = () => {
    console.log("Downloading report");
    toast({
      title: "Скачивание отчета",
      description: "Отчет аудита успешно скачан",
    });
    // In a real app, this would generate and download a PDF report
  };

  if (isLoading || !auditData) {
    return (
      <Card className="w-full bg-card/90 backdrop-blur-sm border-border">
        <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-xl font-medium">Анализ сайта {url}</p>
          <p className="text-muted-foreground mt-2">Это может занять несколько минут...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card/90 backdrop-blur-sm border-border">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">Аудит сайта: {url}</CardTitle>
              <CardDescription>
                Дата проверки: {new Date(auditData.date).toLocaleDateString('ru-RU')} | 
                Страниц проверено: {auditData.pageCount}
              </CardDescription>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Обновить
              </Button>
              <Button variant="default" size="sm" onClick={handleDownloadReport}>
                <FileDown className="h-4 w-4 mr-2" />
                Скачать отчет
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="overview" className="data-[state=active]:text-primary">
            <BarChart2 className="w-4 h-4 mr-2" /> Обзор
          </TabsTrigger>
          <TabsTrigger value="issues" className="data-[state=active]:text-primary">
            <FileText className="w-4 h-4 mr-2" /> Проблемы
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:text-primary">
            <FileDown className="w-4 h-4 mr-2" /> Отчеты
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-0 space-y-4">
          <AuditOverview auditData={auditData} />
        </TabsContent>
        
        <TabsContent value="issues" className="mt-0 space-y-4">
          <AuditIssues auditData={auditData} />
        </TabsContent>
        
        <TabsContent value="reports" className="mt-0 space-y-4">
          <AuditReports auditData={auditData} url={url} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteAuditContent;
