
import React from "react";
import AdminMonitoringContainer from "@/components/admin/monitoring/AdminMonitoringContainer";
import { Card, CardContent } from "@/components/ui/card";

const AdminMonitoringPage: React.FC = () => (
  <div className="container mx-auto px-6 py-10 max-w-6xl">
    <h1 className="text-3xl font-bold mb-4">Мониторинг</h1>
    <p className="text-muted-foreground text-lg max-w-3xl mb-6">
      Слежение за состоянием системы, событийный журнал, распределение ресурсов и предупреждения.
    </p>
    <Card className="backdrop-blur-sm bg-card/80 border shadow-sm">
      <CardContent className="p-0">
        <AdminMonitoringContainer />
      </CardContent>
    </Card>
    <div className="mt-10 text-sm text-muted-foreground space-y-3 max-w-3xl">
      <p><b>Возможности:</b> центральный мониторинг, системные графики, журнал ошибок и оповещений.</p>
      <ul className="list-disc pl-6">
        <li>Статистика нагрузки и ресурсов</li>
        <li>Просмотр предупреждений</li>
        <li>История критических событий</li>
      </ul>
    </div>
  </div>
);

export default AdminMonitoringPage;
