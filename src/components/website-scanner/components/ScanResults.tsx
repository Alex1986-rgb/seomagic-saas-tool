
import React from 'react';
import { Search } from 'lucide-react';

interface ScanResultsProps {
  results: any[];
  isLoading?: boolean;
}

const ScanResults: React.FC<ScanResultsProps> = ({ results, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-muted">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">Нет результатов</h3>
        <p className="text-sm text-muted-foreground">
          Запустите сканирование, чтобы увидеть результаты анализа сайта
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Результаты сканирования</h2>
      <div className="border rounded-md">
        {results.map((result, index) => (
          <div 
            key={index} 
            className="p-4 border-b last:border-b-0 flex items-start gap-3"
          >
            <div>
              <h3 className="font-medium">{result.title}</h3>
              <p className="text-sm text-muted-foreground">{result.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScanResults;
