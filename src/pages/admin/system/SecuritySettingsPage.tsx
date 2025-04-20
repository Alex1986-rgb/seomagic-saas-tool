
import React from "react";
import SecuritySettings from "@/components/admin/system/SecuritySettings";
import { Card, CardContent } from "@/components/ui/card";

const SecurityMonitor = () => (
  <div className="border rounded-md p-4 bg-muted my-6">
    <div className="text-md font-medium mb-2">Состояние безопасности:</div>
    <div className="flex flex-wrap gap-8 text-sm text-muted-foreground">
      <div>Двухфакторная аутентификация: <span className="text-green-600 font-bold">Включено</span></div>
      <div>Активные IP ограничения: <span className="text-green-600 font-bold">2</span></div>
      <div>Брутфорс-защита: <span className="text-green-600 font-bold">Работает</span></div>
      <div>Последняя смена пароля: <span className="text-foreground">12.04.2025</span></div>
      <div>Неудачных попыток логина за сутки: <span className="text-orange-600 font-bold">5</span></div>
    </div>
  </div>
);

const SecuritySettingsPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-3xl">
    <h2 className="text-2xl font-bold mb-3">Безопасность</h2>
    <p className="mb-4 text-muted-foreground">Настройки защиты и политики безопасности, текущий статус важных параметров.</p>
    <SecurityMonitor />
    <Card>
      <CardContent className="p-0">
        <SecuritySettings />
      </CardContent>
    </Card>
    <div className="mt-8 text-sm text-muted-foreground space-y-2">
      <div><b>Возможности:</b> двухфакторная аутентификация, журнал событий, защита по IP, смена пароля.</div>
      <ul className="list-disc pl-5">
        <li>Гибкое управление политиками безопасности</li>
        <li>Отслеживание подозрительных событий</li>
        <li>Активация режимов защиты</li>
      </ul>
      <div>Совет: обновляйте критические настройки раз в квартал.</div>
    </div>
  </div>
);

export default SecuritySettingsPage;

