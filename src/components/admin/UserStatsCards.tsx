import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserPlus, ShieldCheck, Loader2 } from "lucide-react";
import { useUsersOverview } from "@/hooks/use-users-overview";

/**
 * Карточки по пользователям.
 *
 * Было: «97 пользователей», «82 активных (85 %)», «+22 % за месяц»,
 * «14 текущих подключений» — все числа вписаны руками. Кто активен и кто
 * сейчас онлайн, платформа не отслеживает, поэтому таких карточек больше нет.
 * Осталось то, что считается по `profiles` и `user_roles`.
 */
const UserStatsCards: React.FC = () => {
  const { overview, isLoading, error } = useUsersOverview();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Считаем пользователей...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
        Не удалось загрузить пользователей: {error}
      </div>
    );
  }

  const stats = [
    {
      label: "Всего пользователей",
      value: String(overview.total),
      icon: <Users className="h-5 w-5 text-[#36CFFF]" />,
      hint: "Записей в таблице profiles",
    },
    {
      label: "Новых за 30 дней",
      value: String(overview.newLastMonth),
      icon: <UserPlus className="h-5 w-5 text-[#8B5CF6]" />,
      hint: overview.newLastMonth === 0 ? "За месяц регистраций не было" : "По дате создания профиля",
    },
    {
      label: "С ролью администратора",
      value: String(overview.admins),
      icon: <ShieldCheck className="h-5 w-5 text-[#14CC8C]" />,
      hint: "Записи role = admin в user_roles",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
      {stats.map((s) => (
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
              <div className="text-xs text-[#9a9ab0] mt-1 font-normal">{s.hint}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserStatsCards;
