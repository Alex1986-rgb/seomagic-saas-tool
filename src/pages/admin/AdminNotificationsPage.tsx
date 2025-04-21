
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const AdminNotificationsPage: React.FC = () => (
  <div className="container mx-auto px-4 py-8 max-w-3xl">
    <h2 className="text-2xl font-bold mb-3">Уведомления администратора</h2>
    <p className="mb-4 text-muted-foreground">
      Центр всех системных и пользовательских уведомлений. Получайте, управляйте, настраивайте оповещения для важных событий.
    </p>
    <Card>
      <CardContent className="py-6">
        <div className="text-md mb-2 font-medium text-primary">Здесь будут показаны все уведомления для администратора.</div>
        <div className="text-sm text-muted-foreground">Пока нет новых сообщений.</div>
      </CardContent>
    </Card>
    <div className="mt-8 text-sm text-muted-foreground space-y-2">
      <div>
        <b>Возможности:</b> настройка типов уведомлений, резервные контакты, история рассылок.
      </div>
      <ul className="list-disc pl-5">
        <li>Мониторинг email, SMS и Slack</li>
        <li>Просмотр истории</li>
        <li>Оповещения о важных событиях</li>
      </ul>
    </div>
  </div>
);

export default AdminNotificationsPage;
