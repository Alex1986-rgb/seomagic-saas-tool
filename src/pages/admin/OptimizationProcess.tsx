
import React from 'react';
import { Helmet } from 'react-helmet-async';
import OptimizationProcessContainer from '@/components/admin/process/OptimizationProcessContainer';
import { Card } from "@/components/ui/card";
import { Settings, Monitor, BarChart2, Globe } from "lucide-react";

const OptimizationProcess: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <Helmet>
        <title>Процесс оптимизации | Админ панель</title>
      </Helmet>
      
      <div className="mb-8 px-6 py-8 rounded-3xl bg-gradient-to-br from-[#1A1F2C] via-[#4c2e91] to-[#403E43] flex items-center gap-6 border border-[#483194]/30 shadow-2xl">
        <div className="bg-[#28213a]/80 text-primary rounded-full p-5 shadow-lg border border-[#7E69AB]/30">
          <Settings className="h-10 w-10 text-[#8B5CF6]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gradient bg-gradient-to-r from-[#9b87f5] via-[#8B5CF6] to-[#0EA5E9] bg-clip-text text-transparent">
            Процесс оптимизации сайтов
          </h1>
          <div className="flex gap-4 text-muted-foreground">
            <BarChart2 className="h-5 w-5" /> Многопоточность
            <Monitor className="h-5 w-5" /> Мониторинг
            <Globe className="h-5 w-5" /> Массовая оптимизация
          </div>
        </div>
      </div>
      
      <OptimizationProcessContainer />
      
      <div className="mt-8 text-sm text-muted-foreground space-y-2 px-4">
        <p><b>О функционале:</b> Система позволяет одновременно оптимизировать до 30 сайтов в параллельном режиме с использованием распределенных вычислительных ресурсов.</p>
        <ul className="list-disc pl-5">
          <li>Многопоточная обработка запросов</li>
          <li>Мониторинг использования системных ресурсов</li>
          <li>Интеллектуальное распределение нагрузки</li>
          <li>Автоматическое восстановление после сбоев</li>
        </ul>
      </div>
    </div>
  );
};

export default OptimizationProcess;
