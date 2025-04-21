
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
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {systemStatus.map((item) => (
      <div key={item.name}
        className="border border-primary/30 rounded-2xl p-5 bg-gradient-to-br from-[#222222] via-[#2e2a44] to-[#23263b] shadow-lg glass-morphism flex flex-col justify-between min-h-[150px]">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-shrink-0">
            {iconMap[item.icon] ?? <Server className="h-6 w-6 text-muted-foreground" />}
          </div>
          <div className="text-lg font-semibold font-playfair text-white">{item.name}</div>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <Badge
            variant={item.status === "Online" ? "outline" : "destructive"}
            className={
              item.status === "Online"
                ? "bg-green-950/70 text-green-400 border-green-700/50"
                : item.status === "Warning"
                ? "bg-amber-950/70 text-amber-400 border-amber-700/50"
                : "bg-red-950/70 text-red-400 border-red-700/50"
            }
          >
            {item.status}
          </Badge>
          <span className="text-sm text-muted-foreground">Uptime: {item.uptime}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Последний перезапуск: {item.lastRestart}
        </div>
      </div>
    ))}
  </div>
);

export default SystemStatusGrid;
