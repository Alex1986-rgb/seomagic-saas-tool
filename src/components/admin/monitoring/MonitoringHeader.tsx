
import React from "react";

const MonitoringHeader: React.FC = () => (
  <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
    <h1 className="text-2xl md:text-3xl font-bold mb-3">Панель мониторинга системы</h1>
    <p className="text-muted-foreground max-w-2xl">
      Актуальный статус платформы, основные показатели работы, мониторинг ресурсов,
      быстрые переходы в ключевые разделы управления и критические уведомления.
    </p>
  </div>
);

export default MonitoringHeader;
