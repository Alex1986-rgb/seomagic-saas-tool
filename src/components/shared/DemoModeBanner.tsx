import React, { useState } from 'react';
import { isDemoMode } from '@/integrations/supabase/client';
import { Info, X } from 'lucide-react';

/**
 * Небольшой индикатор демо-режима. Показывается только когда не заданы
 * реальные ключи Supabase (приложение работает на демонстрационных данных).
 */
const DemoModeBanner: React.FC = () => {
  const [hidden, setHidden] = useState(false);

  if (!isDemoMode || hidden) return null;

  return (
    <div
      className="fixed bottom-4 left-4 z-[60] flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-200 shadow-lg backdrop-blur"
      role="status"
    >
      <Info className="h-4 w-4 shrink-0 text-amber-400" />
      <span>
        Демо-режим — показаны демонстрационные данные. Добавьте ключи Supabase в{' '}
        <code className="rounded bg-black/30 px-1">.env.local</code> для реального бэкенда.
      </span>
      <button
        onClick={() => setHidden(true)}
        className="ml-1 rounded p-0.5 hover:bg-amber-500/20"
        aria-label="Скрыть"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default DemoModeBanner;
