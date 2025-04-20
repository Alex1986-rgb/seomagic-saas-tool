
import React from "react";
import UsersManagement from "@/components/admin/system/UsersManagement";
import { Card, CardContent } from "@/components/ui/card";

const UsersManagementPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-3xl">
    <h2 className="text-2xl font-bold mb-3">Пользователи системы</h2>
    <Card>
      <CardContent className="p-0">
        <UsersManagement />
      </CardContent>
    </Card>
    <div className="mt-8 text-sm text-muted-foreground space-y-2">
      <div><b>Возможности:</b> управление администраторами, права, активация/деактивация.</div>
      <ul className="list-disc pl-5">
        <li>Список всех пользователей</li>
        <li>Редактирование и добавление новых админов</li>
        <li>Смена ролей и управления доступом</li>
      </ul>
      <div>Внимание: администраторы имеют полный доступ к настройкам системы!</div>
    </div>
  </div>
);

export default UsersManagementPage;
