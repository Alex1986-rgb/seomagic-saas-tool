import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Share2, Receipt } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AuditReportActionsProps {
  url: string;
  onGeneratePdf?: () => void;
  onExportJSON?: () => void;
  onViewEstimate?: () => void;
  onShare?: () => void;
}

const AuditReportActions: React.FC<AuditReportActionsProps> = ({
  url,
  onGeneratePdf,
  onExportJSON,
  onViewEstimate,
  onShare
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">Отчёт готов</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {onGeneratePdf && (
                <Button
                  onClick={onGeneratePdf}
                  variant="default"
                  size="sm"
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Скачать PDF
                </Button>
              )}
              
              {onExportJSON && (
                <Button
                  onClick={onExportJSON}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Экспорт JSON
                </Button>
              )}
              
              {onViewEstimate && (
                <Button
                  onClick={onViewEstimate}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Receipt className="h-4 w-4" />
                  Смета
                </Button>
              )}
              
              {onShare && (
                <Button
                  onClick={onShare}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Поделиться
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AuditReportActions;
