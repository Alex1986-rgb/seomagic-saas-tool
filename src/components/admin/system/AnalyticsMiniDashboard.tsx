
import React from "react";

const AnalyticsMiniDashboard = () => (
  <div className="border rounded-md p-4 bg-gradient-to-r from-green-50 to-emerald-50 my-6">
    <div className="text-md font-medium mb-2">Дашборд аналитики:</div>
    <div className="flex flex-wrap gap-8 text-sm text-muted-foreground">
      <div>Сайтов с аналитикой: <span className="text-foreground font-medium">7</span></div>
      <div>Google Analytics: <span className="text-green-600 font-bold">Активно</span></div>
      <div>Сбор пользовательских запросов: <span className="text-green-600 font-bold">Включено</span></div>
      <div>Среднее время загрузки: <span className="text-foreground font-medium">1.3 сек</span></div>
      <div>Ошибки JS за вчера: <span className="text-orange-600 font-bold">4</span></div>
      <div>Дата последнего обновления дашборда: <span className="text-foreground font-medium">19.04.2025</span></div>
    </div>
  </div>
);

export default AnalyticsMiniDashboard;
