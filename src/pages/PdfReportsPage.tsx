import React from 'react';
import { PdfReportsHistory } from '@/components/audit/share/PdfReportsHistory';

const PdfReportsPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">PDF Отчеты</h1>
          <p className="text-muted-foreground">
            Здесь вы можете просмотреть и скачать все ваши сохраненные PDF отчеты
          </p>
        </div>
        
        <PdfReportsHistory />
      </div>
    </div>
  );
};

export default PdfReportsPage;
