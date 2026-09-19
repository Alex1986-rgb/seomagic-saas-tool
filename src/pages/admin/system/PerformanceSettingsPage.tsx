import React from "react";
import { Link } from "react-router-dom";
import PerformanceSettings from "@/components/admin/system/PerformanceSettings";
import { Card, CardContent } from "@/components/ui/card";
import PageSeo from '@/components/seo/PageSeo';

/**
 * Производительность.
 *
 * Убран блок «Мониторинг производительности»: «Средняя загрузка CPU: 34%»,
 * «Память занята: 68%», «Время отклика API: 97 мс», «Последний сбой:
 * 15.04.2025». Метрик сервера сервис не собирает, числа были вписаны в код.
 */
const PerformanceSettingsPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-3xl">
    <PageSeo
      title="Производительность: метрики сервера не собираются"
      description="Загрузку процессора, память и диск сервис не измеряет; реальные данные о вызовах серверных функций и ошибках — на странице мониторинга."
      noindex
    />
    <h2 className="text-2xl font-bold mb-3">Производительность</h2>
    <p className="mb-4 text-muted-foreground">
      Записанные вызовы функций, ошибки и среднюю длительность смотрите на странице{' '}
      <Link to="/admin/monitoring" className="text-primary hover:underline">
        мониторинга
      </Link>
      .
    </p>
    <Card>
      <CardContent className="p-0">
        <PerformanceSettings />
      </CardContent>
    </Card>
  </div>
);

export default PerformanceSettingsPage;
