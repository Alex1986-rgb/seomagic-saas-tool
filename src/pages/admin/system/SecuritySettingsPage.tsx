
import React from "react";
import SecuritySettings from "@/components/admin/system/SecuritySettings";
import { Card, CardContent } from "@/components/ui/card";

const SecuritySettingsPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-3xl">
    <h2 className="text-2xl font-bold mb-3">Настройки безопасности</h2>
    <Card>
      <CardContent className="p-0">
        <SecuritySettings />
      </CardContent>
    </Card>
    <div className="mt-8 text-sm text-muted-foreground space-y-2">
      <div><b>Возможности:</b> двухфакторная аутентификация, ограничение по IP, защита от перебора паролей.</div>
      <ul className="list-disc pl-5">
        <li>Включение/отключение двухфакторной аутентификации</li>
        <li>Ограничение доступа по IP</li>
        <li>Глобальный пароль администратора</li>
        <li>Защита от перебора паролей</li>
      </ul>
      <div>Рекомендуется применять дополнительные меры защиты для критически важных операций.</div>
    </div>
  </div>
);

export default SecuritySettingsPage;
