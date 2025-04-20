
import React from "react";
import AnalyticsSettings from "@/components/admin/system/AnalyticsSettings";
import { Card, CardContent } from "@/components/ui/card";

const AnalyticsSettingsPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-3xl">
    <h2 className="text-2xl font-bold mb-3">Аналитика</h2>
    <Card>
      <CardContent className="p-0">
        <AnalyticsSettings />
      </CardContent>
    </Card>
    <div className="mt-8 text-sm text-muted-foreground space-y-2">
      <div><b>Возможности:</b> интеграция Google Analytics, собственная аналитика, хранение данных.</div>
      <ul className="list-disc pl-5">
        <li>Google Analytics, форма для ID</li>
        <li>Собственный модуль аналитики</li>
        <li>Выбор типа собираемых данных и срока хранения</li>
      </ul>
      <div>Контролируйте виды данных для аналитики по требованиям GDPR.</div>
    </div>
  </div>
);

export default AnalyticsSettingsPage;
