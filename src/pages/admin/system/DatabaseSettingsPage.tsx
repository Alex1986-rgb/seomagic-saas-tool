
import React from "react";
import DatabaseSettings from "@/components/admin/system/DatabaseSettings";
import { Card, CardContent } from "@/components/ui/card";

const DatabaseSettingsPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-3xl">
    <h2 className="text-2xl font-bold mb-3">Настройки базы данных</h2>
    <Card>
      <CardContent className="p-0">
        <DatabaseSettings />
      </CardContent>
    </Card>
    <div className="mt-8 text-sm text-muted-foreground space-y-2">
      <div><b>Возможности:</b> подключение к PostgreSQL, оптимизация, проверка соединения, параметры доступа.</div>
      <ul className="list-disc pl-5">
        <li>Ввод основных параметров (host, порт, пользователь, имя БД)</li>
        <li>Настройка пароля администратора</li>
        <li>Пул подключений и кеширование</li>
        <li>Тестирование подключения</li>
      </ul>
      <div className="pt-2">Рекомендация: после изменения не забывайте сохранять настройки.</div>
    </div>
  </div>
);

export default DatabaseSettingsPage;
