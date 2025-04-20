
import React from "react";

const MonitoringHeader: React.FC = () => (
  <div className="relative rounded-2xl overflow-hidden mb-8 shadow bg-gradient-to-br from-primary/80 via-indigo-200/40 to-white/90">
    <div className="px-8 py-8 md:py-12 relative z-10">
      <h1 className="text-3xl md:text-4xl font-black mb-3 text-primary drop-shadow">
        Панель мониторинга системы
      </h1>
      <p className="text-muted-foreground text-base md:text-lg max-w-2xl font-medium">
        Актуальный статус платформы, основные показатели работы, мониторинг ресурсов,
        быстрые переходы в ключевые разделы управления и критические уведомления.
      </p>
    </div>
    <div
      className="absolute right-0 top-0 w-48 h-48 bg-indigo-200/10 rounded-full blur-2xl"
      style={{ zIndex: 1, transform: "translateY(-40%) scale(1.2)" }}
    />
    <div
      className="absolute left-0 bottom-0 w-40 h-40 bg-primary/20 rounded-full blur-2xl"
      style={{ zIndex: 1, transform: "translateY(20%) scale(1.2)" }}
    />
  </div>
);

export default MonitoringHeader;
