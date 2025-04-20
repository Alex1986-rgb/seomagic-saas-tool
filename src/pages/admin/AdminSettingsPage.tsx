
import React from 'react';
import AdminSettings from '@/components/admin/AdminSettings';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const AdminSettingsPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-2xl font-bold mb-2">Настройки администратора</h1>
      <p className="text-muted-foreground mb-6 max-w-2xl">
        Управление настройками платформы, пользователями, интеграциями и системой
      </p>
      
      <AdminSettings />
      
      <div className="mt-10 text-sm text-muted-foreground">
        <Card className="bg-card/80 backdrop-blur-sm border border-primary/10 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Информация для администраторов</CardTitle>
            <CardDescription>Важные рекомендации по управлению системой</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1">
              <li>Все изменения настроек автоматически логируются</li>
              <li>Для критических изменений требуется дополнительное подтверждение</li>
              <li>После изменения системных настроек рекомендуется перезапустить сервисы</li>
              <li>Резервное копирование настроек выполняется автоматически раз в сутки</li>
              <li>При возникновении проблем обратитесь к документации или в техподдержку</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
