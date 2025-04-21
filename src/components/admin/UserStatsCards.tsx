
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, User, Activity, Server } from "lucide-react";

const stats = [
  { label: "Всего пользователей", value: "97", icon: <Users className="h-5 w-5 text-[#36CFFF]" /> },
  { label: "Активных", value: "82", icon: <Activity className="h-5 w-5 text-[#14CC8C]" />, sub: "85%" },
  { label: "Новых за месяц", value: "14", icon: <User className="h-5 w-5 text-[#8B5CF6]" />, sub: "+22%" },
  { label: "Текущие подключения", value: "14", icon: <Server className="h-5 w-5 text-[#F6C778]" /> },
];

const UserStatsCards: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
    {stats.map(s => (
      <Card
        key={s.label}
        className="shadow-lg hover:shadow-xl transition bg-gradient-to-br from-[#191B22]/95 via-[#23263B]/85 to-[#221F26]/95 border-0 rounded-2xl p-1 hover:scale-[1.03] duration-150"
      >
        <CardContent className="p-6 flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            {s.icon}
            <div className="text-3xl font-bold text-white drop-shadow">{s.value}</div>
          </div>
          <div className="text-sm text-[#ccccdd] font-medium tracking-wide">
            {s.label}
            {s.sub && (
              <span className={`ml-3 rounded-full px-2 py-0.5 ${s.sub.startsWith("+") ? "bg-[#223d2c]/80 text-[#14CC8C]" : ""} font-semibold text-xs align-middle`}>
                {s.sub}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default UserStatsCards;
