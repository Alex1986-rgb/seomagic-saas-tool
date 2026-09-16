import React from "react";
import UsersManagement from "@/components/admin/system/UsersManagement";
import UserStatsCards from "@/components/admin/UserStatsCards";
import UserCharts from "@/components/admin/UserCharts";
import { Card, CardContent } from "@/components/ui/card";
import PageSeo from '@/components/seo/PageSeo';

/**
 * Пользователи системы.
 *
 * Со страницы убраны блок «Активность пользователей» (в нём значились
 * «3 администратора», «11 активных» и последний вход некоего Петра Иванова),
 * карточки «97 / 14 / 28 авторизаций сегодня» и вкладка активности по дням
 * недели. Ни авторизаций, ни сессий платформа не записывает. Всё, что
 * осталось, считается по `profiles` и `user_roles`.
 */
const UsersManagementPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-6xl">
    <PageSeo
      title="Пользователи системы: роли, активность и статистика"
      description="Учётные записи сотрудников и клиентов: роли и права доступа, история входов, блокировки и статистика новых регистраций за месяц."
      noindex
    />
    <h2 className="text-2xl font-bold mb-3">Пользователи системы</h2>
    <p className="mb-6 text-muted-foreground">
      Данные из базы: сколько профилей зарегистрировано, как распределены роли
      и кому эти роли выданы.
    </p>

    <UserStatsCards />
    <UserCharts />

    <Card>
      <CardContent className="p-0">
        <UsersManagement />
      </CardContent>
    </Card>
  </div>
);

export default UsersManagementPage;
