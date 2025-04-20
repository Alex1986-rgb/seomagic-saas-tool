
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import SystemSettingsPage from '@/components/admin/system/SystemSettingsPage';

const SystemStatusPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Состояние системы</h1>
        <p className="text-muted-foreground">Управление настройками системы и мониторинг состояния</p>
      </div>
      
      <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 shadow-sm">
        <CardContent className="p-0">
          <SystemSettingsPage />
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemStatusPage;
