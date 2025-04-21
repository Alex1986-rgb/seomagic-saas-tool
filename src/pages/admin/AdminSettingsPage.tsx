
import React from 'react';
import AdminSettings from '@/components/admin/AdminSettings';
import { Card, CardContent } from "@/components/ui/card";

const AdminSettingsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-10 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Настройки администратора</h1>
      <Card className="backdrop-blur-sm bg-card/80 border shadow-sm">
        <CardContent className="p-0">
          <AdminSettings />
        </CardContent>
      </Card>
      <div className="mt-10 text-sm text-muted-foreground space-y-3 max-w-3xl">
        <p><b>Возможности:</b> управление всеми настройками платформы, пользователи, интеграции, безопасность, уведомления.</p>
        <ul className="list-disc pl-6">
          <li>Все изменения настроек автоматически логируются</li>
          <li>Для критических изменений требуется дополнительное подтверждение</li>
          <li>Резервное копирование выполняется раз в сутки</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
