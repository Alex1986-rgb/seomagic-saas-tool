
import React from "react";
import PerformanceSettings from "@/components/admin/system/PerformanceSettings";
import { Card, CardContent } from "@/components/ui/card";

const PerformanceSettingsPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-3xl">
    <h2 className="text-2xl font-bold mb-3">Производительность</h2>
    <Card>
      <CardContent className="p-0">
        <PerformanceSettings />
      </CardContent>
    </Card>
    <div className="mt-8 text-sm text-muted-foreground space-y-2">
      <div><b>Возможности:</b> параметры кеша, лимиты, автоматизация оповещений, оптимизация контента.</div>
      <ul className="list-disc pl-5">
        <li>Включение кеширования и сжатия</li>
        <li>Оптимизация изображений и таймаутов</li>
        <li>Установка порогов для оповещений</li>
      </ul>
      <div>Настроенные уведомления позволят выявлять проблемы производительности заранее.</div>
    </div>
  </div>
);

export default PerformanceSettingsPage;
