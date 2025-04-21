
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

const SystemStatusGrid: React.FC<Props> = ({ systemStatus }) => {
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'database': return <Database className="h-5 w-5 text-green-400" />;
      case 'server': return <Server className="h-5 w-5 text-green-400" />;
      case 'monitor': return <Monitor className="h-5 w-5 text-green-400" />;
      case 'alert-triangle': return <AlertTriangle className="h-5 w-5 text-amber-400" />;
      default: return <Server className="h-5 w-5" />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {systemStatus.map((item) => (
        <div key={item.name} className="border border-primary/20 rounded-lg p-4 bg-gradient-to-br from-[#1A1F2C]/80 via-[#28213a]/80 to-[#403E43]/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            {renderIcon(item.icon)}
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={item.status === "Online" ? "outline" : "destructive"}
                  className={item.status === "Online" ? "bg-green-950/50 text-green-400 border-green-700/50 hover:bg-green-950/70" :
                    item.status === "Warning" ? "bg-amber-950/50 text-amber-400 border-amber-700/50 hover:bg-amber-950/70" :
                    "bg-red-950/50 text-red-400 border-red-700/50 hover:bg-red-950/70"}>
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
};

export default SystemStatusGrid;
