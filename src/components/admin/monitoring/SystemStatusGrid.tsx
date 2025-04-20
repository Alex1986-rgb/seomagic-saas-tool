
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
      case 'database': return <Database className="h-5 w-5 text-green-500" />;
      case 'server': return <Server className="h-5 w-5 text-green-500" />;
      case 'monitor': return <Monitor className="h-5 w-5 text-green-500" />;
      case 'alert-triangle': return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default: return <Server className="h-5 w-5" />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {systemStatus.map((item) => (
        <div key={item.name} className="border rounded-lg p-4 bg-card">
          <div className="flex items-center gap-3">
            {renderIcon(item.icon)}
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={item.status === "Online" ? "outline" : "destructive"}
                  className={item.status === "Online" ? "bg-green-50 text-green-700 hover:bg-green-100" :
                    item.status === "Warning" ? "bg-amber-50 text-amber-700 hover:bg-amber-100" :
                    "bg-red-50 text-red-700 hover:bg-red-100"}>
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
