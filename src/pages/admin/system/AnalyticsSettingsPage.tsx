
import React from "react";
import AnalyticsSettings from "@/components/admin/system/AnalyticsSettings";
import { Card, CardContent } from "@/components/ui/card";

const AnalyticsMiniDashboard = () => (
  <div className="border rounded-md p-4 bg-muted my-6">
    <div className="text-md font-medium mb-2">Дашборд аналитики:</div>
    <div className="flex flex-wrap gap-8 text-sm text-muted-foreground">
      <div>Сайтов с аналитикой: <span className="text-foreground">7</span></div>
      <div>Google Analytics: <span className="text-green-600 font-bold">Активно</span></div>
      <div>Сбор пользовательских запросов: <span className="text-green-600 font-bold">Включено</span></div>
      <div>Среднее время загрузки: <span className="text-foreground">1.3 сек</span></div>
      <div>Ошибки JS за вчера: <span className="text-orange-600 font-bold">4</span></div>
      <div>Дата последнего обновления дашборда: <span className="text-foreground">19.04.2025</span></div>
    </div>
  </div>
);

const AnalyticsSettingsPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-3xl">
    <h2 className="text-2xl font-bold mb-3">Аналитика</h2>
    <p className="mb-4 text-muted-foreground">Настройки сбора и анализа данных системы, подключение интеграций.</p>
    <AnalyticsMiniDashboard />
    <Card>
      <CardContent className="p-0">
        <AnalyticsSettings />
      </CardContent>
    </Card>
    <div className="mt-8 text-sm text-muted-foreground space-y-2">
      <div><b>Возможности:</b> Google Analytics, собственная аналитика, хранение данных.</div>
      <ul className="list-disc pl-5">
        <li>Гибкая настройка интеграций</li>
        <li>Сбор важнейшей статистики</li>
        <li>Дашборд текущих показателей</li>
      </ul>
      <div>Обратите внимание: аналитика соответствует требованиям GDPR.</div>
    </div>
  </div>
);

export default AnalyticsSettingsPage;

