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
 *
 * Подпись внизу обещала «Что настраивается: интеграции внешней аналитики и
 * правила хранения данных», хотя форма ниже ничего не сохраняла. Теперь форма
 * честно говорит, что не подключена, и подпись этому не противоречит.
 */
const AnalyticsSettingsPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-6xl">
    <PageSeo
      title="Аналитика: счётчики работ платформы"
      description="Сколько аудитов, оптимизаций, проверок позиций и пользователей есть в базе. Посещаемость сайта сервис не измеряет."
      noindex
    />
    <h2 className="text-2xl font-bold mb-3">Аналитика</h2>
    <p className="mb-4 text-muted-foreground">
      Счётчики работ платформы по данным из базы.
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
      <div>
        Пока счётчик посещаемости не поставлен в сборку сайта и не начал присылать данные,
        разделы с посещаемостью останутся пустыми — вымышленных цифр здесь не будет.
      </div>
    </div>
  </div>
);

export default AnalyticsSettingsPage;
