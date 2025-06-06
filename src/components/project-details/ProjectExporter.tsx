
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Code, Package } from 'lucide-react';

const ProjectExporter: React.FC = () => {
  const handleExportPDF = () => {
    console.log('Экспорт в PDF');
    // Здесь будет логика экспорта в PDF
  };

  const handleExportJSON = () => {
    console.log('Экспорт в JSON');
    // Здесь будет логика экспорта в JSON
  };

  const handleExportCode = () => {
    console.log('Экспорт исходного кода');
    // Здесь будет логика экспорта кода
  };

  const handleExportArchive = () => {
    console.log('Экспорт архива проекта');
    // Здесь будет логика создания архива
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Экспорт проекта
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            onClick={handleExportPDF}
            className="flex items-center gap-2 h-auto p-4 flex-col"
          >
            <FileText className="h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold">PDF отчет</div>
              <div className="text-xs text-muted-foreground">Полное описание проекта</div>
            </div>
          </Button>

          <Button 
            variant="outline" 
            onClick={handleExportJSON}
            className="flex items-center gap-2 h-auto p-4 flex-col"
          >
            <Code className="h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold">JSON данные</div>
              <div className="text-xs text-muted-foreground">Структурированные данные</div>
            </div>
          </Button>

          <Button 
            variant="outline" 
            onClick={handleExportCode}
            className="flex items-center gap-2 h-auto p-4 flex-col"
          >
            <Package className="h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold">Исходный код</div>
              <div className="text-xs text-muted-foreground">Скачать весь проект</div>
            </div>
          </Button>

          <Button 
            variant="outline" 
            onClick={handleExportArchive}
            className="flex items-center gap-2 h-auto p-4 flex-col"
          >
            <Download className="h-6 w-6" />
            <div className="text-center">
              <div className="font-semibold">Архив проекта</div>
              <div className="text-xs text-muted-foreground">ZIP с документацией</div>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectExporter;
