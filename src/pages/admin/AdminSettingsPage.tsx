
import React from 'react';
import AdminSettings from '@/components/admin/AdminSettings';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const AdminSettingsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-10 max-w-6xl">
      <h1 className="text-3xl font-bold mb-4">Настройки администратора</h1>
      <p className="text-muted-foreground mb-8 max-w-3xl text-lg">
        Управление всеми настройками платформы: пользователи, интеграции, безопасность, уведомления и параметры сайта.
      </p>
      <Card className="backdrop-blur-sm bg-card/80 border shadow-sm">
        <CardContent className="p-0">
          <AdminSettings />
        </CardContent>
      </Card>
      <div className="mt-12 text-sm text-muted-foreground max-w-3xl">
        <Card className="bg-card/80 backdrop-blur-sm border shadow-sm border-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Информация для администраторов</CardTitle>
            <CardDescription>Важные рекомендации по управлению системой</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-1">
              <li>Все изменения настроек автоматически логируются</li>
              <li>Для критических изменений требуется дополнительное подтверждение</li>
              <li>Резервное копирование выполняется раз в сутки</li>
              <li>Обратитесь к документации или в техподдержку при возникновении проблем</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
