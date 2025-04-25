
import React from 'react';
import { Monitor } from 'lucide-react';

const SupabaseWarning = () => {
  return (
    <div className="flex items-center gap-3 bg-[#191827]/95 border-l-4 border-[#FFC107] rounded-xl p-3 shadow mb-8">
      <Monitor className="h-6 w-6 text-[#FFC107]" />
      <span className="text-[#ffd76b] text-sm">
        Для полноценного сканирования подключите базу данных <span className="text-[#36CFFF] font-semibold">Supabase</span>.
      </span>
    </div>
  );
};

export default SupabaseWarning;
