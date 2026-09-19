import React from "react";
import { Link } from "react-router-dom";
import NotificationsSettings from "@/components/admin/system/NotificationsSettings";
import { Card, CardContent } from "@/components/ui/card";
import PageSeo from '@/components/seo/PageSeo';

/**
 * Системные уведомления.
 *
 * Убран блок «Мониторинг уведомлений»: «Email-уведомлений отправлено: 89»,
 * «SMS-рассылок: 11», «Slack интеграция: Подключено», «Критические ошибки за
 * сутки: 2». Рассылок и интеграций нет, числа были вписаны в код.
 */
const NotificationsSettingsPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-3xl">
    <PageSeo
      title="Системные уведомления: каналы оповещений не подключены"
      description="Рассылка оповещений администратору по почте, SMS и в Slack пока не подключена; уведомления платформы сохраняются в базе и видны в админке."
      noindex
    />
    <h2 className="text-2xl font-bold mb-3">Системные уведомления</h2>
    <p className="mb-4 text-muted-foreground">
      Записанные уведомления смотрите в разделе{' '}
      <Link to="/admin/notifications" className="text-primary hover:underline">
        «Уведомления»
      </Link>
      .
    </p>
    <Card>
      <CardContent className="p-0">
        <NotificationsSettings />
      </CardContent>
    </Card>
  </div>
);

export default NotificationsSettingsPage;
