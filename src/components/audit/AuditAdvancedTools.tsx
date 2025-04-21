import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SimpleSitemapCreatorTool, AdvancedAnalysisTools } from '@/components/audit/deep-crawl';
import AdvancedSitemapExtractor from '@/components/audit/deep-crawl/AdvancedSitemapExtractor';

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
  const [domain, setDomain] = useState(() => {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      return urlObj.hostname;
    } catch (error) {
      return url;
    }
  });

  return (
    <div className="mt-12 mb-10 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Расширенные инструменты</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleTools}
          className="flex items-center gap-1"
        >
          {showAdvancedTools ? (
            <>
              <ChevronUp className="h-4 w-4" />
              <span>Скрыть</span>
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              <span>Показать</span>
            </>
          )}
        </Button>
      </div>
      
      <Separator />
      
      <AnimatePresence mode="wait">
        {showAdvancedTools && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-6 pt-4">
              <SimpleSitemapCreatorTool 
                domain={domain} 
                initialUrl={url}
                onUrlsScanned={onUrlsScanned}
              />
              
              <AdvancedSitemapExtractor
                domain={domain}
                initialUrl={url}
                onUrlsScanned={onUrlsScanned}
              />
              
              {scannedUrls.length > 0 && (
                <AdvancedAnalysisTools 
                  domain={domain}
                  urls={scannedUrls}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuditAdvancedTools;
