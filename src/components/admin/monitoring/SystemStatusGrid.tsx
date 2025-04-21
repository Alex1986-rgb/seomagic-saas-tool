
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
  <div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {systemStatus.map((item) => (
        <div 
          key={item.name}
          className="border border-primary/30 rounded-2xl p-6 bg-gradient-to-br from-[#1A1F2C] via-[#2e2a44] to-[#23263b] shadow-xl transition-all duration-200 hover:shadow-2xl flex flex-col justify-between min-h-[170px]"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-[#2A2E3B]/60 p-2.5 rounded-xl shadow-inner border border-primary/10">
              {iconMap[item.icon] ?? <Server className="h-6 w-6 text-muted-foreground" />}
            </div>
            <div className="text-lg font-bold text-white">{item.name}</div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge
                variant={item.status === "Online" ? "outline" : "destructive"}
                className={
                  item.status === "Online"
                    ? "bg-green-950/70 text-green-400 border-green-700/50 px-3 py-1"
                    : item.status === "Warning"
                    ? "bg-amber-950/70 text-amber-400 border-amber-700/50 px-3 py-1"
                    : "bg-red-950/70 text-red-400 border-red-700/50 px-3 py-1"
                }
              >
                {item.status}
              </Badge>
            </div>
            
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">Uptime:</span>
                <span className="text-sm text-blue-300">{item.uptime}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Последний перезапуск:</span>
                <span className="text-xs text-muted-foreground">{item.lastRestart}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default SystemStatusGrid;
