
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import SystemSettingsPage from '@/components/admin/system/SystemSettingsPage';

const SystemStatusPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Состояние системы</h2>
        <p className="text-muted-foreground mb-4">
          Общая информация и навигация по настройкам платформы, инфраструктуры, мониторинг и безопасность.
        </p>
      </div>
      <Card className="backdrop-blur-sm bg-card/80 border shadow-sm">
        <CardContent className="p-0">
          <SystemSettingsPage />
        </CardContent>
      </Card>
      <div className="mt-8 text-sm text-muted-foreground space-y-2">
        <div><b>Возможности:</b> контроль модулей, мониторинг, история изменений, быстрые переходы к параметрам.</div>
      </div>
    </div>
  );
};

export default SystemStatusPage;
