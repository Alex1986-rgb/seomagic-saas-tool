import React from "react";
import DatabaseSettings from "@/components/admin/system/DatabaseSettings";
import { Card, CardContent } from "@/components/ui/card";
import PageSeo from '@/components/seo/PageSeo';

/**
 * База данных.
 *
 * Убран блок «Мониторинг БД»: «Подключений: 12», «Средняя нагрузка: 23%», «Время
 * отклика: 58 мс», «Дата последнего резервного копирования: 19.04.2025» — все
 * числа были вписаны в код, сервис их не измеряет.
 */
const DatabaseSettingsPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-3xl">
    <PageSeo
      title="База данных: где смотреть подключения и нагрузку"
      description="Параметры подключения, нагрузка и резервные копии базы управляются в панели Supabase; админка сервиса их не показывает и не меняет."
      noindex
    />
    <h1 className="text-3xl font-bold mb-6">База данных</h1>
    <p className="mb-4 text-muted-foreground">
      Нагрузку, число подключений и время отклика базы сервис не измеряет.
    </p>
    <Card>
      <CardContent className="p-0">
        <DatabaseSettings />
      </CardContent>
    </Card>
  </div>
);

export default DatabaseSettingsPage;
