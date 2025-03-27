
import React from 'react';
import { motion } from 'framer-motion';
import { Map, Database, Share2, Save, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface CrawlExportTabProps {
  onDownloadSitemap: () => void;
  onDownloadAllData: () => void;
}

const CrawlExportTab: React.FC<CrawlExportTabProps> = ({
  onDownloadSitemap,
  onDownloadAllData
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          className="p-4 border rounded-lg flex flex-col items-center text-center"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
        >
          <Map className="h-8 w-8 text-primary mb-2" />
          <h3 className="font-medium">Карта сайта (XML)</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Стандартный формат для поисковых систем
          </p>
          <Button 
            variant="secondary" 
            size="sm"
            className="mt-2"
            onClick={onDownloadSitemap}
          >
            Скачать XML
          </Button>
        </motion.div>
        
        <motion.div 
          className="p-4 border rounded-lg flex flex-col items-center text-center"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
        >
          <Database className="h-8 w-8 text-primary mb-2" />
          <h3 className="font-medium">Полный архив данных</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Все собранные данные и форматы
          </p>
          <Button 
            variant="secondary" 
            size="sm"
            className="mt-2"
            onClick={onDownloadAllData}
          >
            Скачать архив
          </Button>
        </motion.div>
      </div>
      
      <div className="mt-4 p-4 border rounded-lg">
        <h3 className="font-medium mb-2 flex items-center">
          <Share2 className="h-4 w-4 mr-2" />
          <span>Дополнительные опции</span>
        </h3>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Button variant="outline" className="flex items-center gap-1.5">
            <Save className="h-4 w-4" />
            <span>Сохранить в проект</span>
          </Button>
          
          <Button variant="outline" className="flex items-center gap-1.5">
            <Filter className="h-4 w-4" />
            <span>Фильтровать результаты</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CrawlExportTab;
