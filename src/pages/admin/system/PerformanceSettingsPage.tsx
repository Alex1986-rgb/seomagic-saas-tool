
import React from "react";
import PerformanceSettings from "@/components/admin/system/PerformanceSettings";
import { Card, CardContent } from "@/components/ui/card";

const PerformanceDashboard = () => (
  <div className="border rounded-md p-4 bg-muted my-6">
    <div className="text-md font-medium mb-2">Мониторинг производительности:</div>
    <div className="flex flex-wrap gap-8 text-sm text-muted-foreground">
      <div>Средняя загрузка CPU: <span className="text-foreground">34%</span></div>
      <div>Память занята: <span className="text-foreground">68%</span></div>
      <div>Переполнение диска: <span className="text-orange-600 font-bold">Нет</span></div>
      <div>Время отклика API: <span className="text-foreground">97 мс</span></div>
      <div>Активных соединений: <span className="text-foreground">14</span></div>
      <div>Последний сбой: <span className="text-gray-500">15.04.2025</span></div>
    </div>
  </div>
);

const PerformanceSettingsPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-3xl">
    <h2 className="text-2xl font-bold mb-3">Производительность</h2>
    <p className="mb-4 text-muted-foreground">Мониторинг, настройка параметров работы платформы и автоматизация оповещений.</p>
    <PerformanceDashboard />
    <Card>
      <CardContent className="p-0">
        <PerformanceSettings />
      </CardContent>
    </Card>
    <div className="mt-8 text-sm text-muted-foreground space-y-2">
      <div><b>Возможности:</b> кэширование, лимиты, уведомления, автоматизация.</div>
      <ul className="list-disc pl-5">
        <li>Контроль за основными ресурсами</li>
        <li>Настройка пороговых значений и реакции</li>
        <li>Уведомления об аномалиях</li>
      </ul>
      <div>Совет: отслеживайте тренды для прогнозирования роста нагрузки.</div>
    </div>
  </div>
);

export default PerformanceSettingsPage;

