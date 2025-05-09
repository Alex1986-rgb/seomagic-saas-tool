
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileDown, FileText, Table, BarChart2, PieChart } from "lucide-react";

interface AuditReportsProps {
  auditData: any;
  url: string;
}

const AuditReports: React.FC<AuditReportsProps> = ({ auditData, url }) => {
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleGenerateReport = (reportType: string) => {
    setGeneratingReport(reportType);
    
    // Simulate report generation
    setTimeout(() => {
      setGeneratingReport(null);
      
      toast({
        title: "Отчет готов",
        description: `Отчет "${reportType}" успешно создан и скачан`,
      });
    }, 2000);
  };
  
  const reports = [
    {
      id: 'full',
      title: 'Полный отчет аудита',
      description: 'Подробный отчет со всеми проверками, проблемами и рекомендациями',
      icon: <FileText className="h-8 w-8 text-primary" />,
      format: 'PDF'
    },
    {
      id: 'issues',
      title: 'Отчет по проблемам',
      description: 'Отчет, содержащий только обнаруженные проблемы и рекомендации по их исправлению',
      icon: <Table className="h-8 w-8 text-orange-500" />,
      format: 'PDF'
    },
    {
      id: 'performance',
      title: 'Отчет по производительности',
      description: 'Детальный анализ скорости загрузки сайта и метрик производительности',
      icon: <BarChart2 className="h-8 w-8 text-blue-500" />,
      format: 'PDF'
    },
    {
      id: 'seo',
      title: 'SEO отчет',
      description: 'Анализ SEO-оптимизации сайта с рекомендациями по улучшению',
      icon: <PieChart className="h-8 w-8 text-green-500" />,
      format: 'PDF'
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-card/90 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle>Отчеты аудита</CardTitle>
          <CardDescription>Создание и скачивание различных отчетов по результатам аудита</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map(report => (
              <Card key={report.id} className="bg-card/50 border-border">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{report.title}</CardTitle>
                      <CardDescription className="mt-1">{report.description}</CardDescription>
                    </div>
                    <div>
                      {report.icon}
                    </div>
                  </div>
                </CardHeader>
                <CardFooter className="pt-2 flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    Формат: {report.format}
                  </div>
                  <Button 
                    size="sm"
                    variant="default"
                    disabled={generatingReport === report.id}
                    onClick={() => handleGenerateReport(report.title)}
                  >
                    {generatingReport === report.id ? (
                      <>
                        <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-t-transparent border-white" />
                        Создание...
                      </>
                    ) : (
                      <>
                        <FileDown className="h-4 w-4 mr-2" />
                        Скачать
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card/90 backdrop-blur-sm border-border overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle>Экспорт данных</CardTitle>
          <CardDescription>
            Экспорт данных аудита в различных форматах для последующего анализа
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4 px-4 flex-col items-center justify-center gap-3 hover:bg-primary/5">
              <FileDown className="h-6 w-6" />
              <div className="text-center">
                <p className="font-medium">JSON</p>
                <p className="text-xs text-muted-foreground">Экспорт всех данных</p>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto py-4 px-4 flex-col items-center justify-center gap-3 hover:bg-primary/5">
              <Table className="h-6 w-6" />
              <div className="text-center">
                <p className="font-medium">CSV</p>
                <p className="text-xs text-muted-foreground">Таблица проблем</p>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto py-4 px-4 flex-col items-center justify-center gap-3 hover:bg-primary/5">
              <BarChart2 className="h-6 w-6" />
              <div className="text-center">
                <p className="font-medium">XML</p>
                <p className="text-xs text-muted-foreground">Sitemap данные</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditReports;
