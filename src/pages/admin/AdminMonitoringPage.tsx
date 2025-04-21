
import React from "react";
import { Helmet } from 'react-helmet-async';
import AdminMonitoringContainer from "@/components/admin/monitoring/AdminMonitoringContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Gauge, AlertTriangle, Monitor, BarChart2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AdminMonitoringPage: React.FC = () => (
  <>
    <Helmet>
      <title>Мониторинг | Админ панель</title>
    </Helmet>
    
    <div className="container mx-auto px-4 md:px-6 py-10 max-w-6xl">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="bg-purple-100 text-primary p-4 rounded-2xl shadow hover:scale-110 transition">
            <Monitor className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gradient-primary mb-0.5">
              Мониторинг платформы
            </h1>
            <p className="text-muted-foreground">
              Ключевые индикаторы, истории событий и контроль производительности в реальном времени.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-orange-50/80 text-orange-700 rounded-xl border border-orange-200 shadow px-5 py-3">
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
        <Link to="/admin/website-analyzer">
          <Button variant="outline" className="hover-scale" size="sm">
            Анализатор сайтов
          </Button>
        </Link>
      </div>
      <Card className="bg-gradient-to-br from-purple-50 via-white/70 to-indigo-50 border-0 shadow-2xl">
        <CardContent className="p-0">
          <AdminMonitoringContainer />
        </CardContent>
      </Card>
      <div className="mt-10 text-sm text-muted-foreground space-y-3 max-w-3xl">
        <p className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-primary" />
          <b>Возможности:</b> современные графики мониторинга, статусные панели, история событий, предупреждения.
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Реалтайм статистика по серверам и инфраструктуре</li>
          <li>Ключевые предупреждения и оповещения о сбоях</li>
          <li>Детальный журнал ошибок</li>
          <li>Статусные панели по API и серверу</li>
        </ul>
        <div className="flex items-center gap-1 mt-3">
          <Info className="h-4 w-4 text-blue-400" />
          <span>Для расширенного анализа — используйте <Link to="/admin/analytics" className="underline text-blue-800">раздел аналитики</Link>.</span>
        </div>
      </div>
    </div>
  </>
);

export default AdminMonitoringPage;
