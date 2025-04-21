
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AlertTriangle, Info, Database, Activity, Server } from "lucide-react";

interface EventItem {
  time: string;
  event: string;
  type: string;
  icon: string;
}
interface Props {
  recentEvents: EventItem[];
}

const eventTypeColors = {
  error: "bg-red-950/70 text-red-400",
  warning: "bg-amber-950/70 text-amber-300",
  info: "bg-blue-950/70 text-blue-300",
  default: "bg-[#222341]/60 text-muted-foreground"
};

const iconMap = {
  info: <Info className="h-5 w-5" />,
  "alert-triangle": <AlertTriangle className="h-5 w-5" />,
  database: <Database className="h-5 w-5" />,
  activity: <Activity className="h-5 w-5" />,
  server: <Server className="h-5 w-5" />,
};

const EventLog: React.FC<Props> = ({ recentEvents }) => (
  <Card className="shadow lg:col-span-2 border-0 bg-gradient-to-br from-[#191b2a]/80 via-[#23263b]/80 to-[#403E43]/80 glass-morphism">
    <CardHeader className="pb-2 flex flex-row items-center gap-3">
      <Activity className="text-[#14CC8C] rounded-lg p-2 h-8 w-8 bg-emerald-900/20 mr-1" />
      <div>
        <CardTitle className="text-lg font-medium font-playfair">Журнал событий</CardTitle>
        <CardDescription>Последние действия и системные события</CardDescription>
      </div>
    </CardHeader>
    <CardContent>
      <div className="divide-y divide-border/30">
        {recentEvents.map((event, idx) => (
          <div key={idx} className="py-3 flex items-center gap-4">
            <div className={`rounded-full p-2 shadow ${eventTypeColors[event.type] || eventTypeColors.default}`}>
              {iconMap[event.icon] ?? <Info className="h-5 w-5" />}
            </div>
            <div className="flex-1">
              <div className="text-base font-medium">{event.event}</div>
              <div className="text-xs text-muted-foreground">{event.time}</div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default EventLog;
