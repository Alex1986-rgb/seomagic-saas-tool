
import React from "react";
import { Helmet } from 'react-helmet-async';
import AdminMonitoringContainer from "@/components/admin/monitoring/AdminMonitoringContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Gauge, AlertTriangle, Monitor, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AdminMonitoringPage: React.FC = () => (
  <>
    <Helmet>
      <title>Мониторинг | Админ панель</title>
    </Helmet>
    
    <div className="container mx-auto px-4 md:px-6 py-10 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 text-blue-700 p-2 rounded-lg shadow">
              <Monitor className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gradient-primary">Мониторинг платформы</h1>
          </div>
          <p className="text-muted-foreground">
            Реальное время, ключевые индикаторы, контроль производительности и истории событий.
          </p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2.5 bg-orange-50 text-orange-700 rounded-lg border border-orange-200 shadow">
          <AlertTriangle className="h-5 w-5 mr-1" />
          <div className="text-sm">
            <div className="font-medium">Высокая нагрузка API</div>
            <div className="text-xs text-orange-500">543 запр/мин</div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mb-8">
        <Link to="/admin">
          <Button variant="outline" className="hover-scale" size="sm">
            На главную
          </Button>
        </Link>
        <Link to="/admin/settings">
          <Button variant="outline" className="hover-scale" size="sm">
            Настройки
          </Button>
        </Link>
        <Link to="/admin/users">
          <Button variant="outline" className="hover-scale" size="sm">
            Пользователи
          </Button>
        </Link>
        <Link to="/admin/analytics">
          <Button variant="outline" className="hover-scale" size="sm">
            Аналитика
          </Button>
        </Link>
      </div>
      <Card className="backdrop-blur-xl bg-gradient-to-br from-blue-50 via-white/70 to-indigo-50 border-0 shadow-2xl">
        <CardContent className="p-0">
          <AdminMonitoringContainer />
        </CardContent>
      </Card>
      <div className="mt-10 text-sm text-muted-foreground space-y-3 max-w-3xl">
        <p className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-primary" />
          <b>Возможности:</b> современные графики, уведомления, история событий, статус панелей.
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Реалтайм статистика по ресурсам</li>
          <li>Ключевые предупреждения и оповещения</li>
          <li>Детальный журнал ошибок и событий</li>
          <li>Информативные статусные панели</li>
        </ul>
        <div className="flex items-center gap-1 mt-3">
          <Info className="h-4 w-4 text-blue-400" />
          <span>Если требуется глубокий анализ — воспользуйтесь <Link to="/admin/analytics" className="underline text-blue-800">разделом аналитики</Link>.</span>
        </div>
      </div>
    </div>
  </>
);

export default AdminMonitoringPage;
