import React from "react";
import SecuritySettings from "@/components/admin/system/SecuritySettings";
import { Card, CardContent } from "@/components/ui/card";
import PageSeo from '@/components/seo/PageSeo';

/**
 * Безопасность.
 *
 * С этой страницы убран блок «Состояние безопасности»: «Двухфакторная
 * аутентификация: Включено», «Брутфорс-защита: Работает», «Неудачных попыток
 * логина за сутки: 5», «Активные IP ограничения: 2». Ничего из этого сервис не
 * включает и не считает — владелец видел защиту, которой нет, и не принимал мер.
 */
const SecuritySettingsPage = () => (
  <div className="container mx-auto px-4 py-8 max-w-3xl">
    <PageSeo
      title="Безопасность: где настраивается защита входа"
      description="Двухфакторная аутентификация и ограничения входа настраиваются в Supabase Auth, а не в админке; права доступа задаются ролями пользователей."
      noindex
    />
    <h2 className="text-2xl font-bold mb-3">Безопасность</h2>
    <p className="mb-4 text-muted-foreground">
      Что на самом деле отвечает за защиту входа и где это настраивается.
    </p>
    <Card>
      <CardContent className="p-0">
        <SecuritySettings />
      </CardContent>
    </Card>
  </div>
);

export default SecuritySettingsPage;
