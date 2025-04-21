
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import SystemSettingsPage from '@/components/admin/system/SystemSettingsPage';

const SystemStatusPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-10 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">Состояние системы</h1>
        <p className="text-muted-foreground text-lg max-w-3xl">
          Общая информация и навигация по настройкам платформы, инфраструктуры, мониторинг и безопасность.
        </p>
      </div>
      <Card className="backdrop-blur-sm bg-card/80 border shadow-sm">
        <CardContent className="p-0">
          <SystemSettingsPage />
        </CardContent>
      </Card>
      <div className="mt-10 text-sm text-muted-foreground space-y-3 max-w-3xl">
        <p><b>Возможности:</b> контроль модулей, мониторинг, история изменений, быстрые переходы к параметрам.</p>
      </div>
    </div>
  );
};

export default SystemStatusPage;
