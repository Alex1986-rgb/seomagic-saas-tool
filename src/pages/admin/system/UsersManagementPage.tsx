
import React from "react";
import UsersManagement from "@/components/admin/system/UsersManagement";
import { Card, CardContent } from "@/components/ui/card";

const UsersActivity = () => (
  <div className="border rounded-md p-4 bg-muted mb-6">
    <div className="text-md font-medium mb-2">Активность пользователей:</div>
    <div className="flex flex-wrap gap-8 text-sm text-muted-foreground">
      <div>Всего администраторов: <span className="text-foreground">3</span></div>
      <div>Активных пользователей: <span className="text-foreground">11</span></div>
      <div>Последний вход: <span className="text-foreground">Петр Иванов — 18.04.2025, 10:19</span></div>
      <div>Новых за месяц: <span className="text-foreground">1</span></div>
      <div>Временная блокировка: <span className="text-green-600 font-bold">Нет</span></div>
    </div>
  </div>
);

const UsersManagementPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-3xl">
    <h2 className="text-2xl font-bold mb-3">Пользователи системы</h2>
    <UsersActivity />
    <Card>
      <CardContent className="p-0">
        <UsersManagement />
      </CardContent>
    </Card>
    <div className="mt-8 text-sm text-muted-foreground space-y-2">
      <div><b>Возможности:</b> список пользователей, управление правами, журнал активности.</div>
      <ul className="list-disc pl-5">
        <li>Добавление, блокировка, удаление пользователей</li>
        <li>Изменение ролей и ограничений</li>
        <li>Отображение истории входов</li>
        <li>Статистика действий</li>
      </ul>
      <div>Внимание: все действия администраторов фиксируются для истории.</div>
    </div>
  </div>
);

export default UsersManagementPage;

