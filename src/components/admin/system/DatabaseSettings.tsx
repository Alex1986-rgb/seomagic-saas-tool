import React from 'react';
import NotCollectedNotice from '@/components/admin/NotCollectedNotice';

/**
 * Настройки базы данных.
 *
 * Здесь была форма подключения с подставленными localhost:5432, seomarket_db и
 * postgres, переключатели пула соединений и кеширования и кнопки «Сохранить» и
 * «Проверить соединение», которые только писали в консоль. Браузер к базе
 * напрямую не подключается, а параметры подключения меняются не отсюда.
 */
const DatabaseSettings: React.FC = () => (
  <div className="p-6">
    <NotCollectedNotice
      title="Подключение к базе из админки не настраивается"
      description="Форма и кнопки, которые здесь были, ничего не сохраняли и ни к чему не подключались. Как устроено на самом деле:"
      items={[
        "база — PostgreSQL в проекте Supabase; сайт обращается к ней через API Supabase с проверкой прав (RLS)",
        "параметры подключения, пул соединений и нагрузка — в панели Supabase, разделы Database и Reports",
        "структура таблиц меняется миграциями в папке supabase/migrations",
      ]}
    />
  </div>
);

export default DatabaseSettings;
