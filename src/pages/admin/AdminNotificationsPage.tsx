
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const AdminNotificationsPage: React.FC = () => (
  <div className="container mx-auto px-6 py-10 max-w-4xl">
    <h1 className="text-3xl font-bold mb-4">Уведомления администратора</h1>
    <p className="text-muted-foreground max-w-3xl mb-8 text-lg">
      Центр всех системных и пользовательских уведомлений. Получайте, управляйте, настраивайте оповещения для важных событий.
    </p>
    <Card className="backdrop-blur-sm bg-card/80 border shadow-sm">
      <CardContent className="py-8 px-6">
        <div className="text-md mb-3 font-semibold text-primary">Здесь будут показаны все уведомления для администратора.</div>
        <div className="text-sm text-muted-foreground">Пока нет новых сообщений.</div>
      </CardContent>
    </Card>
    <div className="mt-10 text-sm text-muted-foreground space-y-3 max-w-3xl">
      <p>
        <b>Возможности:</b> настройка типов уведомлений, резервные контакты, история рассылок.
      </p>
      <ul className="list-disc pl-6">
        <li>Мониторинг email, SMS и Slack</li>
        <li>Просмотр истории</li>
        <li>Оповещения о важных событиях</li>
      </ul>
    </div>
  </div>
);

export default AdminNotificationsPage;
