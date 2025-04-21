
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, User, Activity, Server } from "lucide-react";

const stats = [
  { label: "Всего пользователей", value: "97", icon: <Users className="h-5 w-5 text-blue-500" /> },
  { label: "Активных", value: "82", icon: <Activity className="h-5 w-5 text-green-500" />, sub: "85%" },
  { label: "Новых за месяц", value: "14", icon: <User className="h-5 w-5 text-purple-500" />, sub: "+22%" },
  { label: "Текущие подключения", value: "14", icon: <Server className="h-5 w-5 text-orange-500" /> },
];

const UserStatsCards: React.FC = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    {stats.map(s => (
      <Card key={s.label} className="shadow hover:shadow-md transition">
        <CardContent className="p-4 flex flex-col gap-2">
          <div className="flex gap-3 items-center">
            {s.icon}
            <div className="text-2xl font-bold">{s.value}</div>
          </div>
          <div className="text-xs text-muted-foreground">
            {s.label} {s.sub && <span className={`ml-2 ${s.sub.startsWith("+") ? "text-green-500" : ""}`}>{s.sub}</span>}
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default UserStatsCards;
