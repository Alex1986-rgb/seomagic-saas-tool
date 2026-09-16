
import React from "react";
import AdminMonitoringContainer from "@/components/admin/monitoring/AdminMonitoringContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Gauge, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageSeo from '@/components/seo/PageSeo';

const AdminMonitoringPage: React.FC = () => (
  <>
    <PageSeo
      title="Мониторинг платформы: нагрузка и состояние сервисов"
      description="Показатели работы платформы в реальном времени: нагрузка на API, состояние серверов, журнал событий и предупреждения о сбоях."
      noindex
    />
    <div className="w-full min-h-screen flex flex-col items-center justify-start bg-gradient-to-bl from-[#1A1F2C] via-[#191B22] to-[#403E43]">
      {/* Шапка монитора */}
      <div className="w-full max-w-6xl mx-auto mt-10 mb-8 px-4 md:px-10">
        <div className="flex flex-col md:flex-row items-center gap-8 px-6 py-8 rounded-3xl bg-gradient-to-br from-[#4c2e91] via-[#6a4bc7] to-[#0ea5e9] border border-primary/30 shadow-2xl animate-fade-in">
          <div className="flex-shrink-0 bg-primary/30 text-primary rounded-full p-6 glass-morphism shadow-lg">
            <Monitor className="h-12 w-12" />
          </div>
          <div className="flex-1 min-w-[210px]">
            <h1 className="text-4xl font-extrabold mb-2 tracking-tight text-gradient-primary">Мониторинг платформы</h1>
            <p className="text-muted-foreground text-lg">
              Вызовы функций платформы за последние сутки и счётчики выполненных работ.
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
        </div>
      </div>
      {/* Основной мониторинговый блок */}
      <div className="w-full max-w-7xl mx-auto mb-10">
        <Card className="rounded-3xl border-0 shadow-2xl glass-morphism bg-gradient-to-br from-[#3A238A] via-[#5B47BA] to-[#178CD8]">
          <CardContent className="p-0">
            <AdminMonitoringContainer />
          </CardContent>
        </Card>
      </div>
      {/* Описание возможностей */}
      <div className="w-full max-w-3xl mx-auto mb-10 text-sm text-muted-foreground space-y-3 px-4">
        <p className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-primary" />
          <b>Что показывает раздел:</b> данные из журнала <code>api_logs</code> и счётчики работ платформы.
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Вызовы edge-функций за сутки и доля ошибок</li>
          <li>Средняя длительность вызова там, где время замерено</li>
          <li>Сколько аудитов, оптимизаций, проверок позиций и заявок в базе</li>
          <li>Нагрузка сервера, память и диск не отслеживаются</li>
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

