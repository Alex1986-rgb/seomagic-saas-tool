
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import SystemSettingsPage from '@/components/admin/system/SystemSettingsPage';

const SystemStatusPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-10 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Состояние системы</h1>
      <Card className="backdrop-blur-sm bg-card/80 border shadow-sm">
        <CardContent className="p-0">
          <SystemSettingsPage />
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemStatusPage;
