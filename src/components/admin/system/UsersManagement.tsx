import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAdminAccounts } from '@/hooks/use-admin-accounts';
import { formatDate, roleLabel } from '@/lib/admin-stats';
import NotCollectedNotice from '@/components/admin/NotCollectedNotice';

/**
 * Учётные записи с назначенными ролями.
 *
 * Раньше здесь жил массив MOCK_ADMINS: Александр Иванов, Мария Петрова,
 * Сергей Смирнов и Анна Кузнецова с адресами @example.com и датами
 * «последнего входа». Таких людей не существует, а входы платформа не
 * фиксирует. Теперь список приходит из `user_roles` и `profiles`.
 *
 * Форма «Добавить пользователя» тоже убрана: её кнопка «Сохранить» ничего не
 * сохраняла. Пользователи регистрируются сами, роль меняется в разделе
 * «Пользователи».
 */
const UsersManagement: React.FC = () => {
  const { accounts, isLoading, error } = useAdminAccounts();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = accounts.filter((account) => {
    const haystack = `${account.fullName ?? ''} ${account.email ?? ''} ${account.role}`.toLowerCase();
    return haystack.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="p-6 space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Поиск по имени, email или роли..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          Не удалось загрузить учётные записи: {error}
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Загружаем учётные записи...
            </div>
          ) : filtered.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">
              {accounts.length === 0
                ? 'Ролей пока никому не назначено — в таблице user_roles нет записей.'
                : 'По запросу никого не нашлось.'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Пользователь</th>
                    <th className="text-left py-3 px-4 font-medium">Роль</th>
                    <th className="text-left py-3 px-4 font-medium">Роль назначена</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((account) => (
                    <tr key={`${account.userId}-${account.role}`} className="border-b hover:bg-accent/5">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={account.avatarUrl ?? undefined} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {(account.fullName || account.email || '?').charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {account.fullName || account.email || 'Профиль не заполнен'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {account.email ?? account.userId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={account.role === 'admin' ? 'default' : 'secondary'}>
                          {roleLabel(account.role)}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-sm">{formatDate(account.grantedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <NotCollectedNotice
        title="Чего в этом списке нет"
        description="Платформа не ведёт журнал входов, поэтому колонок «последний вход» и «активен / неактивен» здесь больше нет. Создание учётной записи из админки не реализовано: пользователи регистрируются сами, а роль выдаётся в разделе «Пользователи»."
      />
    </div>
  );
};

export default UsersManagement;
