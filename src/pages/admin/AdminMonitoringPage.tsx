
import React from "react";
import { Helmet } from 'react-helmet-async';
import AdminMonitoringContainer from "@/components/admin/monitoring/AdminMonitoringContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Gauge, AlertTriangle, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AdminMonitoringPage: React.FC = () => (
  <>
    <Helmet>
      <title>Мониторинг | Админ панель</title>
    </Helmet>
    <div className="container mx-auto px-4 md:px-8 py-10 max-w-6xl">
      <div className="mb-8 px-8 py-10 rounded-3xl bg-gradient-to-br from-[#4c2e91] via-[#6a4bc7] to-[#0ea5e9] border border-primary/30 shadow-2xl flex flex-col md:flex-row items-center gap-8 animate-fade-in">
        <div className="flex-shrink-0 bg-primary/30 text-primary rounded-full p-6 glass-morphism shadow-lg">
          <Monitor className="h-12 w-12" />
        </div>
        <div className="flex-1 min-w-[210px]">
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight text-gradient-primary">Мониторинг платформы</h1>
          <p className="text-muted-foreground text-lg">
            Ключевые индикаторы, истории событий и контроль производительности в реальном времени.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link to="/admin">
              <Button variant="outline" className="hover-scale border-primary text-primary hover:bg-primary/10">На главную</Button>
            </Link>
            <Link to="/admin/settings">
              <Button variant="outline" className="hover-scale border-primary text-primary hover:bg-primary/10">Настройки</Button>
            </Link>
            <Link to="/admin/users">
              <Button variant="outline" className="hover-scale border-primary text-primary hover:bg-primary/10">Пользователи</Button>
            </Link>
            <Link to="/admin/analytics">
              <Button variant="outline" className="hover-scale border-primary text-primary hover:bg-primary/10">Аналитика</Button>
            </Link>
            <Link to="/admin/website-analyzer">
              <Button variant="outline" className="hover-scale border-primary text-primary hover:bg-primary/10">Анализатор сайтов</Button>
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-orange-900/50 text-orange-400 rounded-xl border border-orange-700 shadow-md px-5 py-3 mt-6 md:mt-0">
          <AlertTriangle className="h-5 w-5 mr-1" />
          <div className="text-sm">
            <div className="font-semibold">Высокая нагрузка API</div>
            <div className="text-xs text-orange-300">543 запр/мин</div>
          </div>
        </div>
      </div>
      <Card className="bg-gradient-to-br from-[#3A238A] via-[#5B47BA] to-[#178CD8] border-0 shadow-2xl glass-morphism">
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
        <div className="flex items-center gap-1 mt-3 text-primary/80">
          <Gauge className="h-4 w-4" />
          <span>Для расширенного анализа — используйте <Link to="/admin/analytics" className="underline hover:text-primary">раздел аналитики</Link>.</span>
        </div>
      </div>
    </div>
  </>
);

export default AdminMonitoringPage;
