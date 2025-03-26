
import React from 'react';
import { Loader2 } from 'lucide-react';

const AuditLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
      <h3 className="text-xl font-medium mb-2">Анализируем сайт</h3>
      <p className="text-muted-foreground">
        Пожалуйста, подождите. Это может занять несколько минут.
      </p>
    </div>
  );
};

export default AuditLoading;
