
import React from 'react';
import AdminSettings from '@/components/admin/AdminSettings';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const AdminSettingsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h2 className="text-2xl font-bold mb-3">Настройки администратора</h2>
      <p className="text-muted-foreground mb-6 max-w-2xl">
        Управление всеми настройками платформы: пользователи, интеграции, безопасность, уведомления и параметры сайта.
      </p>
      <Card>
        <CardContent className="p-0">
          <AdminSettings />
        </CardContent>
      </Card>
      <div className="mt-10 text-sm text-muted-foreground">
        <Card className="bg-card/80 backdrop-blur-sm border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Информация для администраторов</CardTitle>
            <CardDescription>Важные рекомендации по управлению системой</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1">
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
