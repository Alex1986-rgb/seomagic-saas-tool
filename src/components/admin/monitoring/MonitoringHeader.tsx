
import React from "react";

const MonitoringHeader: React.FC = () => (
  <div className="mb-6 p-6 rounded-lg border border-primary/50 bg-gradient-to-r from-[#4c2e91] via-[#6a4bc7] to-[#0ea5e9] shadow-lg text-white">
    <h1 className="text-2xl md:text-3xl font-bold mb-3">Панель мониторинга системы</h1>
    <p className="text-primary/90 max-w-2xl">
      Актуальный статус платформы, основные показатели работы, мониторинг ресурсов,
      быстрые переходы в ключевые разделы управления и критические уведомления.
    </p>
  </div>
);

export default MonitoringHeader;
