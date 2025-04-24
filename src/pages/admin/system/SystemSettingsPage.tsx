
import React from 'react';
import { useNavigate } from "react-router-dom";
import SystemInfo from '@/components/admin/system/SystemInfo';
import SystemModuleTile from '@/components/admin/system/SystemModuleTile';
import { SYSTEM_MODULES } from '@/components/admin/system/systemModulesConfig';

const SystemSettingsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleTileClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Системные настройки</h1>
      <p className="text-muted-foreground mb-3 max-w-2xl">
        Управление инфраструктурой платформы: база данных, безопасность, пользователи, аналитика и мониторинг. 
        Используйте быстрые переходы для настройки модулей — доступ к каждому разделу можно получить ниже.
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

      <div className="mt-10 text-sm text-muted-foreground space-y-2">
        <div><b>Возможности:</b> гибкая настройка платформы, мониторинг состояния модулей, расширенные интеграции, история изменений.</div>
        <ul className="list-disc pl-5">
          <li>Безопасное хранение данных и резервное копирование</li>
          <li>Детальное логирование действий</li>
          <li>Пороговые оповещения и автоматизация событий</li>
        </ul>
        <div>Для критических изменений система может потребовать подтверждение администратора.</div>
      </div>
    </div>
  );
};

export default SystemSettingsPage;
