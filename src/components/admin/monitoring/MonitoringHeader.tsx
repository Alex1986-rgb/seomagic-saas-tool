
import React from "react";

const MonitoringHeader: React.FC = () => (
  <div className="mb-6 p-7 rounded-2xl border-0 bg-gradient-to-br from-[#1A1F2C] via-[#28213a]/90 to-[#403E43]/90 shadow-2xl glass-morphism">
    <h1 className="text-3xl md:text-4xl font-bold mb-3 heading-gradient bg-gradient-to-r from-[#9b87f5] via-[#F97316] to-[#0EA5E9] bg-clip-text text-transparent">
      Панель мониторинга системы
    </h1>
    <p className="text-muted-foreground text-base max-w-2xl">
      Актуальный статус платформы, основные показатели работы, мониторинг ресурсов,&nbsp;
      быстрые переходы в ключевые разделы управления и критические уведомления.
    </p>
  </div>
);

export default MonitoringHeader;
