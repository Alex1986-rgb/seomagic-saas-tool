
import React from 'react';
import { Search, BarChart2 } from 'lucide-react';

const ScannerHeader: React.FC = () => {
  return (
    <div className="mb-6 space-y-2">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Search className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-semibold">Анализатор сайтов</h2>
      </div>
      
      <p className="text-muted-foreground text-sm max-w-3xl">
        Инструмент для сканирования и анализа веб-сайтов. Проверяйте структуру сайта, 
        находите метаданные, анализируйте SEO-показатели и получайте подробные отчеты.
      </p>
      
      <div className="border-t my-4"></div>
      
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-1">
          <BarChart2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Анализ метаданных</span>
        </div>
        <div className="hidden sm:flex items-center space-x-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Проверка ссылок</span>
        </div>
        <div className="hidden md:flex items-center space-x-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Генерация sitemap</span>
        </div>
        <div className="hidden lg:flex items-center space-x-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">SEO аудит</span>
        </div>
      </div>
    </div>
  );
};

export default ScannerHeader;
