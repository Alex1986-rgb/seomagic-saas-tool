import React from "react";
import {
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend,
} from "recharts";
import { Loader2 } from "lucide-react";
import { useUsersOverview } from "@/hooks/use-users-overview";

/**
 * Графики по пользователям.
 *
 * Регистрации по месяцам и роли считаются по `profiles` и `user_roles`.
 * График «Активные пользователи по дням недели» убран: входы и сессии
 * платформа не пишет, так что его столбики были просто нарисованы.
 */

const COLORS = ['#8B5CF6', '#36CFFF', '#14CC8C', '#FFBB28'];
const darkShadow = "0 6px 32px 0 rgba(34,33,67,0.22)";

const UserCharts: React.FC = () => {
  const { overview, isLoading, error } = useUsersOverview();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 my-10 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Строим графики по базе...
      </div>
    );
  }

  if (error) return null;

  const hasUsers = overview.total > 0;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 my-10">
      <div
        className="h-64 rounded-2xl shadow-xl p-6 bg-gradient-to-br from-[#221F26]/95 via-[#23263B]/95 to-[#191B22]/90 border-none"
        style={{ boxShadow: darkShadow }}
      >
        <div className="font-semibold text-lg mb-4 bg-gradient-to-r from-[#9b87f5] via-[#8B5CF6] to-[#0EA5E9] bg-clip-text text-transparent">
          Регистрации по месяцам
        </div>
        {hasUsers ? (
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={overview.registrationsByMonth}>
              <XAxis dataKey="month" stroke="#b2b6cf" />
              <YAxis stroke="#b2b6cf" allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#221F26', border: 'none', color: '#fff' }} />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8B5CF6"
                strokeWidth={3}
                name="Регистрации"
                dot={{ r: 4, stroke: "#fff", strokeWidth: 1 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-[#9a9ab0]">Зарегистрированных пользователей пока нет.</p>
        )}
      </div>

      <div
        className="h-64 rounded-2xl shadow-xl p-6 bg-gradient-to-br from-[#23263B]/95 via-[#191B22]/90 to-[#28213a]/95 border-none"
        style={{ boxShadow: darkShadow }}
      >
        <div className="font-semibold text-lg mb-4 bg-gradient-to-r from-[#8B5CF6] via-[#36CFFF] to-[#14CC8C] bg-clip-text text-transparent">
          Распределение по ролям
        </div>
        {overview.roleDistribution.length > 0 ? (
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={overview.roleDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={75}
                fill="#8B5CF6"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {overview.roleDistribution.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#23263B', border: 'none', color: '#fff' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-[#9a9ab0]">Ролей пока никому не назначено.</p>
        )}
      </div>

      <div
        className="h-64 rounded-2xl shadow-xl p-6 bg-gradient-to-br from-[#191B22]/95 via-[#28213a]/80 to-[#23263B]/95 border-none flex flex-col justify-center"
        style={{ boxShadow: darkShadow }}
      >
        <div className="font-semibold text-lg mb-3 text-[#e6e6f0]">Активность по дням недели</div>
        <p className="text-sm text-[#9a9ab0]">
          Такого графика больше нет: платформа не записывает входы и сессии
          пользователей, измерять активность нечем.
        </p>
      </div>
    </div>
  );
};

export default UserCharts;
