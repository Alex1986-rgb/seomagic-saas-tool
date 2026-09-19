
import React from 'react';
import { useNavigate } from "react-router-dom";
import SystemInfo from '@/components/admin/system/SystemInfo';
import SystemModuleTile from '@/components/admin/system/SystemModuleTile';
import { SYSTEM_MODULES } from '@/components/admin/system/systemModulesConfig';
import PageSeo from '@/components/seo/PageSeo';

const SystemSettingsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleTileClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-4xl mx-auto">
      <PageSeo
        title="Системные настройки: разделы инфраструктуры платформы"
        description="Переходы к разделам базы данных, безопасности, почты, журнала вызовов, пользователей и аналитики с описанием того, где что настраивается."
        noindex
      />
      <h1 className="text-2xl font-bold mb-2">Системные настройки</h1>
      <p className="text-muted-foreground mb-3 max-w-2xl">
        Разделы об инфраструктуре платформы: база данных, безопасность, почта, журнал вызовов,
        пользователи, аналитика и производительность.
      </p>

      <SystemInfo />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {SYSTEM_MODULES.map(module => (
          <SystemModuleTile
            key={module.label}
            icon={module.icon}
            label={module.label}
            desc={module.desc}
            badge={module.badge}
            onClick={() => handleTileClick(module.to)}
          />
        ))}
      </div>

      {/*
        Здесь был список «Возможности»: история изменений, резервное копирование,
        детальное логирование, пороговые оповещения. Ничего из этого в админке
        нет, поэтому вместо обещаний — что разделы на самом деле показывают.
      */}
      <div className="mt-10 text-sm text-muted-foreground space-y-2">
        <div>
          Большинство разделов ниже только объясняют, где настраивается та или иная часть
          платформы (Supabase, секреты проекта, сборка сайта): из админки эти параметры не
          меняются. Реальные данные — пользователи и роли, журнал вызовов функций, счётчики работ.
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsPage;
