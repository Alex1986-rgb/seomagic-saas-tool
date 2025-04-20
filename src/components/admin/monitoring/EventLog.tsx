
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface EventItem {
  time: string;
  event: string;
  type: string;
  icon: React.ReactNode;
}
interface Props {
  recentEvents: EventItem[];
}
const EventLog: React.FC<Props> = ({ recentEvents }) => (
  <Card className="shadow lg:col-span-2">
    <CardHeader className="pb-2">
      <CardTitle className="text-lg font-medium">Журнал событий</CardTitle>
      <CardDescription>Последние действия и системные события</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="divide-y divide-border/30">
        {recentEvents.map((event, idx) => (
          <div key={idx} className="py-3 flex items-center gap-3">
            <div className={`rounded-full p-2 
                ${event.type === 'error' ? 'bg-red-100 text-red-500' : 
                  event.type === 'warning' ? 'bg-amber-100 text-amber-500' : 
                  'bg-blue-100 text-blue-500'}`}>
              {event.icon}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">{event.event}</div>
              <div className="text-xs text-muted-foreground">{event.time}</div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
export default EventLog;
