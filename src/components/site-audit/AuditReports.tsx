
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  FileDown, FileText, BarChart2, CheckCircle, FileCog,
  FileSpreadsheet, File, FileJson, FileSearch, Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface AuditReportsProps {
  auditData: any;
  url: string;
}

const AuditReports: React.FC<AuditReportsProps> = ({ auditData, url }) => {
  const [activeReportTab, setActiveReportTab] = useState('pdf');
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  const { toast } = useToast();

  const reports = [
    {
      id: 'pdf',
      title: 'PDF Отчет',
      icon: <FileText className="h-6 w-6" />,
      description: 'Полный отчет в формате PDF со всеми деталями аудита',
      primaryColor: 'text-red-500',
      badgeText: 'Полный',
      badgeColor: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    },
    {
      id: 'summary',
      title: 'Сводный отчет',
      icon: <BarChart2 className="h-6 w-6" />,
      description: 'Краткий обзор с основными результатами и рекомендациями',
      primaryColor: 'text-blue-500',
      badgeText: 'Быстро',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    },
    {
      id: 'technical',
      title: 'Технический отчет',
      icon: <FileCog className="h-6 w-6" />,
      description: 'Детальный отчет о технических аспектах сайта',
      primaryColor: 'text-purple-500',
      badgeText: 'Технический',
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
    },
    {
      id: 'seo',
      title: 'SEO отчет',
      icon: <FileSearch className="h-6 w-6" />,
      description: 'Анализ SEO оптимизации и рекомендации для улучшения',
      primaryColor: 'text-green-500',
      badgeText: 'SEO',
      badgeColor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    },
    {
      id: 'excel',
      title: 'Excel отчет',
      icon: <FileSpreadsheet className="h-6 w-6" />,
      description: 'Данные аудита в формате Excel для дальнейшего анализа',
      primaryColor: 'text-emerald-500',
      badgeText: 'Excel',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
    },
    {
      id: 'json',
      title: 'JSON данные',
      icon: <FileJson className="h-6 w-6" />,
      description: 'Экспорт данных аудита в формате JSON',
      primaryColor: 'text-amber-500',
      badgeText: 'JSON',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
    }
  ];

  const generateReport = (reportId: string) => {
    setGeneratingReport(reportId);
    
    setTimeout(() => {
      toast({
        title: "Отчет создан",
        description: `Отчет "${reports.find(r => r.id === reportId)?.title}" успешно создан и скачан`,
      });
      setGeneratingReport(null);
    }, 1500);
    
    // In a real app, this would generate and download the selected report format
  };

  const fadeInStagger = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  const activeReport = reports.find(r => r.id === activeReportTab);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-card/90 backdrop-blur-sm border-border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center">
            <FileDown className="mr-2 h-5 w-5" />
            Отчеты аудита
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeReportTab} onValueChange={setActiveReportTab}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1">
                <TabsList className="flex flex-col h-auto p-1 bg-muted/30">
                  {reports.map((report, index) => (
                    <motion.div
                      key={report.id}
                      custom={index}
                      initial="hidden" 
                      animate="visible"
                      variants={fadeInStagger}
                      className="w-full"
                    >
                      <TabsTrigger 
                        value={report.id} 
                        className={`flex items-start justify-start w-full px-3 py-3 ${activeReportTab === report.id ? `${report.primaryColor}` : ''}`}
                      >
                        <div className={`p-2 rounded-md mr-3 ${activeReportTab === report.id ? `${report.primaryColor} bg-primary/10` : 'bg-muted'}`}>
                          {report.icon}
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{report.title}</div>
                          <div className="text-xs text-muted-foreground mt-1 pr-3">
                            {report.description}
                          </div>
                        </div>
                      </TabsTrigger>
                    </motion.div>
                  ))}
                </TabsList>
              </div>
              
              <div className="col-span-1 md:col-span-2">
                {reports.map(report => (
                  <TabsContent key={report.id} value={report.id} className="mt-0">
                    <Card className="border-2">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`p-3 rounded-md ${report.primaryColor} bg-primary/10 mr-4`}>
                              {report.icon}
                            </div>
                            <div>
                              <CardTitle>{report.title}</CardTitle>
                              <p className="text-sm text-muted-foreground mt-1">
                                {report.description}
                              </p>
                            </div>
                          </div>
                          <Badge className={report.badgeColor}>
                            {report.badgeText}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="bg-muted/40 p-4 rounded-md">
                          <h4 className="font-medium mb-2">Содержание отчета</h4>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            <li>Общий обзор и итоговый балл аудита</li>
                            <li>Проблемы и рекомендации ({(auditData.issues?.critical?.length || 0) + (auditData.issues?.important?.length || 0)} критичных)</li>
                            <li>Детальный анализ производительности</li>
                            <li>SEO оптимизация и советы по улучшению</li>
                            <li>Технические аспекты сайта</li>
                            <li>Сравнение с конкурентами в вашей отрасли</li>
                          </ul>
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-3">
                          <Button 
                            onClick={() => generateReport(report.id)}
                            className="flex-1"
                            disabled={generatingReport === report.id}
                          >
                            {generatingReport === report.id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Создание...
                              </>
                            ) : (
                              <>
                                <FileDown className="mr-2 h-4 w-4" />
                                Скачать отчет
                              </>
                            )}
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => toast({
                              title: "Отчет отправлен",
                              description: `Отчет отправлен на вашу электронную почту`,
                            })}
                            className="flex-1"
                          >
                            <File className="mr-2 h-4 w-4" />
                            Отправить на почту
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </div>
            </div>
          </Tabs>
          
          <div className="mt-8 bg-muted/30 p-4 rounded-md flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
            <p className="text-sm">
              Все отчеты включают подробные рекомендации по улучшению сайта {url} и конкретные шаги, которые помогут повысить его эффективность.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AuditReports;
