
import React from "react";
import DatabaseSettings from "@/components/admin/system/DatabaseSettings";
import { Card, CardContent } from "@/components/ui/card";

const DatabaseStats = () => (
  <div className="border rounded-md p-4 bg-muted my-6">
    <div className="text-md font-medium mb-2">Мониторинг БД:</div>
    <div className="flex gap-8 flex-wrap text-sm text-muted-foreground">
      <div>Статус: <span className="text-green-600 font-bold">Активно</span></div>
      <div>Тип: PostgreSQL</div>
      <div>Подключений: <span className="text-foreground">12</span></div>
      <div>Средняя нагрузка: <span className="text-foreground">23%</span></div>
      <div>Время отклика: <span className="text-foreground">58 мс</span></div>
      <div>Дата последнего резервного копирования: <span className="text-foreground">19.04.2025 01:14</span></div>
    </div>
  </div>
);

const DatabaseSettingsPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-3xl">
    <h2 className="text-2xl font-bold mb-3">База данных</h2>
    <p className="mb-4 text-muted-foreground">Настройки подключения и оптимизации базы данных, а также мониторинг состояния сервера.</p>
    <DatabaseStats />
    <Card>
      <CardContent className="p-0">
        <DatabaseSettings />
      </CardContent>
    </Card>
    <div className="mt-8 text-sm text-muted-foreground space-y-2">
      <div><b>Возможности:</b> мониторинг, оптимизация, резервные копии.</div>
      <ul className="list-disc pl-5">
        <li>Настройка параметров подключения</li>
        <li>Включение пула соединений и кеширования</li>
        <li>Проверка работы через тестовое соединение</li>
        <li>Отображение нагрузки и статуса БД</li>
      </ul>
      <div className="pt-2">Рекомендуется следить за нагрузкой для предотвращения простоев.</div>
    </div>
  </div>
);

export default DatabaseSettingsPage;

