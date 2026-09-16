import React from 'react';
import { Info, Loader2 } from 'lucide-react';
import { useUsersOverview } from '@/hooks/use-users-overview';

/**
 * Краткая справка о системе.
 *
 * Здесь были строки «Последний аудит безопасности: 19.04.2025», «Текущий
 * релиз: v2.8.1», «Интеграции активны (Slack, Analytica)» и «Зарегистрировано
 * пользователей: 13, администраторов: 3» — всё вписано в код. Версию релиза
 * и аудиты безопасности проект нигде не хранит, интеграций нет. Оставили
 * единственное, что можно посчитать, — пользователей и роли из базы.
 */
const SystemInfo = () => {
  const { overview, isLoading, error } = useUsersOverview();

  return (
    <div className="bg-gradient-to-br from-blue-600/5 to-indigo-600/5 border rounded-md p-4 flex flex-col md:flex-row md:items-center gap-4 mb-6">
      <Info className="h-6 w-6 text-primary" />
      <div>
        <div className="text-md font-medium mb-1">Краткая информация о системе:</div>
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Считаем пользователей...
          </div>
        ) : error ? (
          <p className="text-sm text-muted-foreground">Данные о пользователях сейчас недоступны.</p>
        ) : (
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 text-sm">
            <li>
              Зарегистрировано пользователей:{' '}
              <span className="text-foreground font-medium">{overview.total}</span>, из них с ролью
              администратора: <span className="font-medium">{overview.admins}</span>
            </li>
            <li>
              Новых за 30 дней:{' '}
              <span className="text-foreground font-medium">{overview.newLastMonth}</span>
            </li>
            <li>Версия релиза, аудиты безопасности и статусы интеграций нигде не фиксируются</li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default SystemInfo;
