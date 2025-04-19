
import React from 'react';
import { motion } from 'framer-motion';
import { Microscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SimpleSitemapCreatorTool, AdvancedAnalysisTools } from '@/components/audit/deep-crawl';

interface AuditAdvancedToolsProps {
  url: string;
  showAdvancedTools: boolean;
  scannedUrls: string[];
  onUrlsScanned: (urls: string[]) => void;
  onToggleTools: () => void;
}

const AuditAdvancedTools: React.FC<AuditAdvancedToolsProps> = ({
  url,
  showAdvancedTools,
  scannedUrls,
  onUrlsScanned,
  onToggleTools
}) => {
  return (
    <motion.div 
      className="mt-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Microscope className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Продвинутый технический анализ</h2>
        </div>
        <Button 
          variant={showAdvancedTools ? "default" : "outline"} 
          onClick={onToggleTools}
        >
          {showAdvancedTools ? 'Скрыть' : 'Показать'}
        </Button>
      </div>
      
      {showAdvancedTools && (
        <div className="space-y-6">
          {scannedUrls.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <SimpleSitemapCreatorTool 
                initialUrl={url} 
                onUrlsScanned={onUrlsScanned} 
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AdvancedAnalysisTools 
                domain={url.replace(/^https?:\/\//, '')} 
                urls={scannedUrls} 
              />
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AuditAdvancedTools;
