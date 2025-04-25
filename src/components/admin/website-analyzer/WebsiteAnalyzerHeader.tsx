
import React from 'react';
import { Monitor, ChartBar } from 'lucide-react';

const WebsiteAnalyzerHeader = () => {
  return (
    <>
      <div className="mb-7 px-3 py-6 rounded-2xl bg-[#191827] shadow-xl flex flex-col md:flex-row items-center gap-5 border border-[#23223b]">
        <div className="flex-shrink-0 bg-[#23223b] rounded-xl p-6 shadow-lg ring-2 ring-[#36CFFF]/70 flex items-center justify-center">
          <Monitor className="h-12 w-12 text-[#36CFFF] animate-pulse-slow" />
        </div>
        <div className="flex-1 min-w-[180px]">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight text-transparent bg-gradient-to-r from-[#8B5CF6] via-[#36CFFF] to-[#F97316] bg-clip-text">
            Анализатор сайтов
          </h1>
          <p className="text-[#A0A8FF] text-sm md:text-base font-medium">
            <span className="text-[#36CFFF] font-bold">Современные инструменты </span>
            для сканирования, анализа и оптимизации сайтов.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <a href="/admin/settings">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#22213B] text-[#8B5CF6] font-bold border border-[#8B5CF6]/40 hover:bg-[#8B5CF6] hover:text-white transition-all duration-200">
                <ChartBar className="h-5 w-5" />
                Настройки
              </button>
            </a>
            <a href="/admin/analytics">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#22213B] text-[#F97316] font-bold border border-[#F97316]/40 hover:bg-[#F97316] hover:text-white transition-all duration-200">
                <ChartBar className="h-5 w-5" />
                Аналитика
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default WebsiteAnalyzerHeader;
