
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
  database: <Database className="h-6 w-6 text-green-700 drop-shadow" />,
  server: <Server className="h-6 w-6 text-purple-700 drop-shadow" />,
  monitor: <Monitor className="h-6 w-6 text-blue-500 drop-shadow" />,
  "alert-triangle": <AlertTriangle className="h-6 w-6 text-amber-600 drop-shadow" />,
};

const SystemStatusGrid: React.FC<Props> = ({ systemStatus }) => (
  <div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {systemStatus.map((item) => (
        <div 
          key={item.name}
          className="border border-gray-300 rounded-2xl p-6 bg-gradient-to-br from-[#F2FCE2] via-[#E5DEFF] to-[#D3E4FD] shadow-lg transition-all duration-200 hover:shadow-xl flex flex-col justify-between min-h-[170px] text-gray-900"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white p-2.5 rounded-xl shadow-inner border border-gray-200">
              {iconMap[item.icon] ?? <Server className="h-6 w-6 text-gray-400" />}
            </div>
            <div className="text-lg font-bold">{item.name}</div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge
                variant={item.status === "Online" ? "outline" : "destructive"}
                className={
                  item.status === "Online"
                    ? "bg-green-100 text-green-700 border-green-300 px-3 py-1"
                    : item.status === "Warning"
                    ? "bg-amber-100 text-amber-700 border-amber-300 px-3 py-1"
                    : "bg-red-100 text-red-700 border-red-300 px-3 py-1"
                }
              >
                {item.status}
              </Badge>
            </div>
            
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">Uptime:</span>
                <span className="text-blue-700">{item.uptime}</span>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>Последний перезапуск:</span>
                <span>{item.lastRestart}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default SystemStatusGrid;
