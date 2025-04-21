
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Database, Server, Monitor, AlertTriangle } from "lucide-react";

export interface SystemStatusItem {
  name: string;
  status: string;
  uptime: string;
  lastRestart: string;
  icon: string;
}

interface Props {
  systemStatus: SystemStatusItem[];
}

const iconMap = {
  database: <Database className="h-6 w-6 text-green-400 drop-shadow" />,
  server: <Server className="h-6 w-6 text-purple-400 drop-shadow" />,
  monitor: <Monitor className="h-6 w-6 text-blue-300 drop-shadow" />,
  "alert-triangle": <AlertTriangle className="h-6 w-6 text-amber-400 drop-shadow" />,
};

const SystemStatusGrid: React.FC<Props> = ({ systemStatus }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
    {systemStatus.map((item) => (
      <div key={item.name}
        className="border border-primary/25 rounded-xl p-5 bg-gradient-to-br from-[#191b2a]/85 via-[#2e2442]/70 to-[#23263b]/85 shadow-lg hover:shadow-xl glass-panel transition-all duration-200 flex flex-col justify-between min-h-[136px]">
        <div className="flex items-center gap-4">
          <div>{iconMap[item.icon] ?? <Server className="h-6 w-6 text-muted-foreground" />}</div>
          <div>
            <div className="font-bold text-lg font-playfair">{item.name}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={item.status === "Online" ? "outline" : "destructive"}
                className={item.status === "Online"
                  ? "bg-green-950/60 text-green-400 border-green-700/40"
                  : item.status === "Warning"
                  ? "bg-amber-950/50 text-amber-400 border-amber-700/50"
                  : "bg-red-950/60 text-red-400 border-red-700/50"}>
                {item.status}
              </Badge>
              <span className="text-xs text-muted-foreground">Uptime: {item.uptime}</span>
            </div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-3">
          Последний перезапуск: {item.lastRestart}
        </div>
      </div>
    ))}
  </div>
);

export default SystemStatusGrid;
