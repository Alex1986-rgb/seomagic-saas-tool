
import React from "react";
import NotificationsSettings from "@/components/admin/system/NotificationsSettings";
import { Card, CardContent } from "@/components/ui/card";

const NotificationsMonitor = () => (
  <div className="border rounded-md p-4 bg-muted my-6">
    <div className="text-md font-medium mb-2">Мониторинг уведомлений:</div>
    <div className="flex flex-wrap gap-8 text-sm text-muted-foreground">
      <div>Email-уведомлений отправлено: <span className="text-foreground">89</span></div>
      <div>SMS-рассылок: <span className="text-foreground">11</span></div>
      <div>Slack интеграция: <span className="text-green-600 font-bold">Подключено</span></div>
      <div>Критические ошибки за сутки: <span className="text-orange-600 font-bold">2</span></div>
      <div>Дата последней рассылки: <span className="text-foreground">19.04.2025 07:41</span></div>
    </div>
  </div>
);

const NotificationsSettingsPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-3xl">
    <h2 className="text-2xl font-bold mb-3">Системные уведомления</h2>
    <p className="mb-4 text-muted-foreground">Настройка email, SMS, Slack уведомлений и мониторинг их состояния.</p>
    <NotificationsMonitor />
    <Card>
      <CardContent className="p-0">
        <NotificationsSettings />
      </CardContent>
    </Card>
    <div className="mt-8 text-sm text-muted-foreground space-y-2">
      <div><b>Возможности:</b> расширенный мониторинг, интеграции, лог рассылок.</div>
      <ul className="list-disc pl-5">
        <li>Управление всеми типами уведомлений</li>
        <li>Информация о рассылках и ошибках</li>
        <li>Интеграция с внешними сервисами</li>
      </ul>
      <div>Рекомендуется указывать резервные контакты для критических событий.</div>
    </div>
  </div>
);

export default NotificationsSettingsPage;

