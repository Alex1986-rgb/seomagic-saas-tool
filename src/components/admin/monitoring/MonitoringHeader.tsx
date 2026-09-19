
import React from "react";
import { Monitor } from "lucide-react";

const MonitoringHeader: React.FC = () => (
  <div className="mb-6 p-8 rounded-2xl border-0 bg-gradient-to-br from-[#151926] via-[#2a2d3b] to-[#211d36] shadow-2xl glass-morphism flex flex-col md:flex-row items-center gap-6">
    <div className="flex-shrink-0 bg-primary/15 rounded-2xl p-6 shadow-lg flex items-center justify-center">
      <Monitor className="h-14 w-14 text-[#8B5CF6] drop-shadow-lg" />
    </div>
    <div>
      <h1 className="text-3xl md:text-4xl font-bold mb-2 font-playfair bg-gradient-to-r from-[#9b87f5] via-[#F97316] to-[#0EA5E9] bg-clip-text text-transparent">
        Панель мониторинга системы
      </h1>
      <p className="text-muted-foreground text-base max-w-2xl">
        Журнал вызовов функций платформы и счётчики выполненных работ.{" "}
        <span className="text-primary/80">Показателей железа здесь нет</span> — платформа их не снимает.
      </p>
    </div>
  </div>
);

export default MonitoringHeader;
