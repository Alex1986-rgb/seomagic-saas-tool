import React from "react";
import AnalyticsSettings from "@/components/admin/system/AnalyticsSettings";
import { Card, CardContent } from "@/components/ui/card";
import AnalyticsStatsCards from "@/components/admin/system/AnalyticsStatsCards";
import NotCollectedNotice from "@/components/admin/NotCollectedNotice";
import PageSeo from '@/components/seo/PageSeo';

/**
 * Настройки аналитики.
 *
 * С этой страницы убраны мини-дашборд («Сайтов с аналитикой: 7», «Ошибки JS
 * за вчера: 4») и вкладки с графиками трафика, отказов и устройств: счётчика
 * посещаемости в проекте нет, все эти данные были нарисованными.
 */
const AnalyticsSettingsPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-6xl">
    <PageSeo
      title="Настройки аналитики: интеграции, сбор и хранение данных"
      description="Подключение внешних систем аналитики и параметры собственной статистики: что именно собирать и как долго хранить данные."
      noindex
    />
    <h2 className="text-2xl font-bold mb-3">Аналитика</h2>
    <p className="mb-4 text-muted-foreground">
      Настройки сбора и хранения данных, а также счётчики работ платформы.
    </p>

    <AnalyticsStatsCards />

    <NotCollectedNotice
      className="mb-6"
      title="Посещаемость сайта платформа не измеряет"
      description="Здесь были графики трафика, просмотров, отказов и устройств. Своего счётчика у сервиса нет, внешняя аналитика не подключена, поэтому таких чисел не существует:"
      items={[
        "посетители, просмотры страниц и источники трафика",
        "конверсия и показатель отказов",
        "распределение по устройствам и времени суток",
      ]}
    />

    <Card>
      <CardContent className="p-0">
        <AnalyticsSettings />
      </CardContent>
    </Card>

    <div className="mt-8 text-sm text-muted-foreground space-y-2">
      <div><b>Что настраивается:</b> интеграции внешней аналитики и правила хранения данных.</div>
      <div>
        Пока интеграция не подключена и не начала присылать данные, разделы с
        посещаемостью останутся пустыми — вымышленных цифр здесь не будет.
      </div>
    </div>
  </div>
);

export default AnalyticsSettingsPage;
