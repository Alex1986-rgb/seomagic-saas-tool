
import React from "react";
import AdminMonitoringContainer from "@/components/admin/monitoring/AdminMonitoringContainer";
import { Card, CardContent } from "@/components/ui/card";

const AdminMonitoringPage: React.FC = () => (
  <div className="container mx-auto px-4 py-8 max-w-5xl">
    <h2 className="text-2xl font-bold mb-3">Мониторинг</h2>
    <p className="mb-4 text-muted-foreground">
      Слежение за состоянием системы, событийный журнал, распределение ресурсов и предупреждения.
    </p>
    <Card>
      <CardContent className="p-0">
        <AdminMonitoringContainer />
      </CardContent>
    </Card>
    <div className="mt-8 text-sm text-muted-foreground space-y-2">
      <div><b>Возможности:</b> центральный мониторинг, системные графики, журнал ошибок и оповещений.</div>
      <ul className="list-disc pl-5">
        <li>Статистика нагрузки и ресурсов</li>
        <li>Просмотр предупреждений</li>
        <li>История критических событий</li>
      </ul>
    </div>
  </div>
);

export default AdminMonitoringPage;
