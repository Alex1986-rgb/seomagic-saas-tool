
import React from 'react';
import { Info } from 'lucide-react';

const SystemInfo: React.FC = () => (
  <div className="bg-gradient-to-br from-blue-600/5 to-indigo-600/5 border rounded-xl p-6 flex flex-col md:flex-row md:items-center gap-4 mb-6">
    <Info className="h-6 w-6 text-primary flex-shrink-0" />
    <div>
      <div className="text-lg font-semibold mb-2">Краткая информация о системе:</div>
      <ul className="list-disc pl-6 text-muted-foreground space-y-1 text-sm">
        <li>Последний аудит безопасности: <span className="text-foreground font-medium">19.04.2025</span></li>
        <li>Текущий релиз: <span className="text-primary font-bold">v2.8.1</span></li>
        <li>Интеграции активны (Slack, Analytics)</li>
        <li>Зарегистрировано пользователей: <span className="text-foreground font-medium">13</span>, администраторов: <span className="font-medium">3</span></li>
      </ul>
    </div>
  </div>
);

export default SystemInfo;
