
import React from "react";
import { Helmet } from 'react-helmet-async';
import AdminMonitoringContainer from "@/components/admin/monitoring/AdminMonitoringContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Gauge, AlertTriangle, Monitor } from "lucide-react";

const AdminMonitoringPage: React.FC = () => (
  <>
    <Helmet>
      <title>Мониторинг | Админ панель</title>
    </Helmet>
    
    <div className="container mx-auto px-6 py-10 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-primary/10 text-primary p-1.5 rounded">
              <Monitor className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-bold">Мониторинг</h1>
          </div>
          <p className="text-muted-foreground">
            Современная панель для контроля состояния системы, графиков и журналов.
          </p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2.5 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20">
          <AlertTriangle className="h-5 w-5" />
          <div className="text-sm">
            <div className="font-medium">Высокая нагрузка API</div>
            <div className="text-xs text-amber-400">543 запр/мин</div>
          </div>
        </div>
      </div>
      <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-50 via-white/60 to-blue-50 border-0 shadow-lg">
        <CardContent className="p-0">
          <AdminMonitoringContainer />
        </CardContent>
      </Card>
      <div className="mt-10 text-sm text-muted-foreground space-y-3 max-w-3xl">
        <p className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-primary" />
          <b>Возможности:</b> современные графики мониторинга, тревоги и статус-панели.
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Статистика нагрузки и ресурсов</li>
          <li>Просмотр предупреждений</li>
          <li>История критических событий</li>
          <li>Оповещения о сбоях</li>
        </ul>
      </div>
    </div>
  </>
);

export default AdminMonitoringPage;
