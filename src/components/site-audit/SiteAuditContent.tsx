
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FileText, BarChart2, FileDown, RefreshCw, Copy, CheckCircle, ExternalLink } from "lucide-react";
import AuditOverview from './AuditOverview';
import AuditReports from './AuditReports';
import AuditIssues from './AuditIssues';
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface SiteAuditContentProps {
  url: string;
}

const SiteAuditContent: React.FC<SiteAuditContentProps> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [auditData, setAuditData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  console.log("SiteAuditContent rendering for URL:", url);

  // Progress animation
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return prev;
          }
          return prev + 5;
        });
      }, 300);
      
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  useEffect(() => {
    const loadAuditData = async () => {
      console.log("Loading audit data for:", url);
      setIsLoading(true);
      setLoadingProgress(0);
      
      try {
        // Simulate API call with progressive loading
        for (let progress = 10; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 300));
          setLoadingProgress(progress);
        }
        
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
    setLoadingProgress(0);
    
    // Re-trigger the useEffect
    setTimeout(() => {
      const loadAuditData = async () => {
        try {
          // Simulate API call with progressive loading
          for (let progress = 10; progress <= 100; progress += 10) {
            await new Promise(resolve => setTimeout(resolve, 200));
            setLoadingProgress(progress);
          }
          
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
  
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast({
      title: "URL скопирован",
      description: "URL сайта скопирован в буфер обмена",
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleVisitSite = () => {
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(formattedUrl, '_blank');
  };

  if (isLoading || !auditData) {
    return (
      <Card className="w-full bg-card/90 backdrop-blur-sm border-border">
        <CardContent className="flex flex-col items-center justify-center min-h-[400px] p-6">
          <div className="w-full max-w-xs mb-6">
            <Progress value={loadingProgress} className="h-2" />
            <p className="text-center text-sm text-muted-foreground mt-2">
              {loadingProgress}% - Анализ сайта
            </p>
          </div>
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-xl font-medium">Анализ сайта {url}</p>
          <p className="text-muted-foreground mt-2">Это может занять несколько минут...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="bg-card/90 backdrop-blur-sm border-border overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">Аудит сайта: {url}</CardTitle>
                <CardDescription>
                  Дата проверки: {new Date(auditData.date).toLocaleDateString('ru-RU')} | 
                  Страниц проверено: {auditData.pageCount}
                </CardDescription>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Обновить
                </Button>
                <Button variant="outline" size="sm" onClick={handleCopyUrl}>
                  {copied ? <CheckCircle className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied ? "Скопировано" : "Копировать URL"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleVisitSite}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Открыть сайт
                </Button>
                <Button variant="default" size="sm" onClick={handleDownloadReport}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Скачать отчет
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {/* Score overview */}
          <CardContent className="pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900">
                <CardContent className="flex justify-between items-center p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Общий рейтинг</p>
                    <h3 className="text-2xl font-bold">{auditData.score}/100</h3>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${auditData.score > 80 ? 'bg-green-500' : auditData.score > 60 ? 'bg-amber-500' : 'bg-red-500'} text-white font-bold`}>
                    {auditData.score}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex justify-between items-center p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Технический рейтинг</p>
                    <h3 className="text-2xl font-bold">{auditData.details.technical.score}/100</h3>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${auditData.details.technical.score > 80 ? 'bg-green-500' : auditData.details.technical.score > 60 ? 'bg-amber-500' : 'bg-red-500'} text-white font-bold`}>
                    {auditData.details.technical.score}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex justify-between items-center p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">SEO рейтинг</p>
                    <h3 className="text-2xl font-bold">{auditData.details.seo.score}/100</h3>
                  </div>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${auditData.details.seo.score > 80 ? 'bg-green-500' : auditData.details.seo.score > 60 ? 'bg-amber-500' : 'bg-red-500'} text-white font-bold`}>
                    {auditData.details.seo.score}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
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
          
          <TabsContent value="overview" className="mt-0 space-y-4 animate-in fade-in-50">
            <AuditOverview auditData={auditData} />
          </TabsContent>
          
          <TabsContent value="issues" className="mt-0 space-y-4 animate-in fade-in-50">
            <AuditIssues auditData={auditData} />
          </TabsContent>
          
          <TabsContent value="reports" className="mt-0 space-y-4 animate-in fade-in-50">
            <AuditReports auditData={auditData} url={url} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default SiteAuditContent;
