
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

const ClientReports: React.FC = () => {
  const reports = [
    {
      name: 'SEO Отчет - example.com',
      date: '15 декабря 2024',
      type: 'PDF',
      size: '2.4 MB'
    },
    {
      name: 'Анализ позиций - Декабрь 2024',
      date: '10 декабря 2024',
      type: 'Excel',
      size: '1.8 MB'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg md:text-xl font-semibold">Отчеты и экспорт данных</h3>
      
      <div className="grid gap-4">
        {reports.map((report, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium text-sm md:text-base">{report.name}</p>
                    <p className="text-xs text-muted-foreground">{report.date} • {report.type} • {report.size}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Скачать
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClientReports;
