
import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface EmptyAuditStateProps {
  onStartNewAudit: () => void;
}

export const EmptyAuditState: React.FC<EmptyAuditStateProps> = ({ onStartNewAudit }) => {
  return (
    <div className="text-center py-8">
      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-xl font-medium mb-2">Нет аудитов</h3>
      <p className="text-muted-foreground mb-6">
        У вас пока нет SEO аудитов. Начните с анализа вашего сайта.
      </p>
      <Button onClick={onStartNewAudit}>
        Запустить новый аудит
      </Button>
    </div>
  );
};

