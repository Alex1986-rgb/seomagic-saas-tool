
import React from "react";
import NotificationsSettings from "@/components/admin/system/NotificationsSettings";
import { Card, CardContent } from "@/components/ui/card";

const NotificationsSettingsPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-3xl">
    <h2 className="text-2xl font-bold mb-3">Системные уведомления</h2>
    <Card>
      <CardContent className="p-0">
        <NotificationsSettings />
      </CardContent>
    </Card>
    <div className="mt-8 text-sm text-muted-foreground space-y-2">
      <div><b>Возможности:</b> email/SMS/Slack уведомления, получатели, виды событий.</div>
      <ul className="list-disc pl-5">
        <li>Настройка email уведомлений и получателей</li>
        <li>Типы уведомлений: ошибки сервера, новые пользователи, лимиты</li>
        <li>Интеграция с SMS и Slack</li>
      </ul>
      <div>Рекомендуется указать резервные контакты для критических событий.</div>
    </div>
  </div>
);

export default NotificationsSettingsPage;
