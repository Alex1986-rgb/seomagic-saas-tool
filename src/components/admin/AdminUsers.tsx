import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, Edit, UserRound, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

type RoleName = 'admin' | 'user';

interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string | null;
  /** Итоговая роль: admin, если среди ролей есть admin; null — записи в user_roles нет. */
  role: RoleName | null;
  /** Все роли из user_roles — нужны, чтобы менять их без конфликта UNIQUE(user_id, role). */
  roles: string[];
}

/** Сколько профилей показываем за раз. */
const PROFILES_LIMIT = 1000;
/** Сколько идентификаторов кладём в один запрос ролей, чтобы не упереться в длину адреса. */
const ROLE_CHUNK = 100;

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return 'Неизвестная ошибка';
}

/**
 * Пользователи и смена ролей.
 *
 * Раньше список запрашивался одним запросом `profiles` со встроенными
 * `user_roles(role)` и `projects(count)`. Таблицы projects в базе нет, а
 * связи profiles ↔ user_roles PostgREST не видит (user_roles ссылается на
 * auth.users), поэтому весь запрос падал: админ видел тост «Ошибка загрузки
 * пользователей» и пустую таблицу, роль поменять было негде. Колонка
 * «Проектов» при этом всегда показывала 0. Теперь профили и роли читаются
 * двумя запросами, а колонки проектов нет — проектов в модели данных нет.
 */
const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [truncated, setTruncated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, avatar_url, created_at')
        .order('created_at', { ascending: false })
        .limit(PROFILES_LIMIT);

      if (error) throw error;

      const rows = profiles ?? [];
      const ids = rows.map((profile) => profile.id);
      const rolesByUser = new Map<string, string[]>();

      for (let i = 0; i < ids.length; i += ROLE_CHUNK) {
        const chunk = ids.slice(i, i + ROLE_CHUNK);
        const { data: roleRows, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role')
          .in('user_id', chunk);

        if (rolesError) throw rolesError;

        for (const row of roleRows ?? []) {
          if (!row.user_id) continue;
          const list = rolesByUser.get(row.user_id) ?? [];
          list.push(row.role);
          rolesByUser.set(row.user_id, list);
        }
      }

      setUsers(
        rows.map((profile) => {
          const roles = rolesByUser.get(profile.id) ?? [];
          const role: RoleName | null = roles.includes('admin')
            ? 'admin'
            : roles.includes('user')
              ? 'user'
              : null;
          return {
            id: profile.id,
            email: profile.email || '',
            full_name: profile.full_name ?? undefined,
            avatar_url: profile.avatar_url ?? undefined,
            created_at: profile.created_at,
            role,
            roles,
          };
        }),
      );
      setTruncated(rows.length === PROFILES_LIMIT);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Ошибка загрузки пользователей",
        description: errorMessage(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Смена роли admin ↔ user.
   *
   * Раньше здесь был update по user_id без проверки результата: если записи
   * роли не было или политика доступа не пропускала изменение, база меняла
   * ноль строк, а админ всё равно видел «Роль пользователя обновлена».
   * Теперь проверяем, что строка действительно изменилась.
   */
  const updateUserRole = async (user: User, newRole: RoleName) => {
    const previousRole: RoleName = newRole === 'admin' ? 'user' : 'admin';

    try {
      let changed = 0;

      if (user.roles.includes(newRole)) {
        // Нужная роль уже есть — достаточно снять лишнюю.
        const { data, error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', user.id)
          .eq('role', previousRole)
          .select('id');
        if (error) throw error;
        changed = data?.length ?? 0;
      } else if (user.roles.includes(previousRole)) {
        const { data, error } = await supabase
          .from('user_roles')
          .update({ role: newRole })
          .eq('user_id', user.id)
          .eq('role', previousRole)
          .select('id');
        if (error) throw error;
        changed = data?.length ?? 0;
      } else {
        const { data, error } = await supabase
          .from('user_roles')
          .insert({ user_id: user.id, role: newRole })
          .select('id');
        if (error) throw error;
        changed = data?.length ?? 0;
      }

      if (changed === 0) {
        throw new Error('База не изменила ни одной записи — вероятно, у вашей учётной записи нет прав администратора.');
      }

      toast({
        title: "Роль пользователя обновлена",
        description: `Теперь: ${newRole === 'admin' ? 'администратор' : 'пользователь'}`,
      });

      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Ошибка обновления роли",
        description: errorMessage(error),
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === 'all' || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const getPlanColor = (role: RoleName | null) => {
    switch(role) {
      case 'admin': return 'bg-[#FF3355]/80 text-white border-none';
      case 'user': return 'bg-[#191B22]/80 text-[#36CFFF] border border-[#36CFFF]/20';
      default: return 'bg-[#23263B]/70 text-white border border-[#483194]/10';
    }
  };

  const roleText = (role: RoleName | null) => {
    if (role === 'admin') return 'Администратор';
    if (role === 'user') return 'Пользователь';
    return 'Без роли';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Загрузка пользователей...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-6 mb-8 items-end">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-[#8B5CF6]" />
            <Input
              placeholder="Поиск пользователей..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#191B22] border border-[#23263B] placeholder:text-[#b2b6cf] text-white focus:border-[#8B5CF6]/60 rounded-lg shadow-md"
            />
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center bg-[#23263B] text-[#b2b6cf] border-none hover:bg-[#28213a] hover:text-[#36CFFF] transition-all rounded-lg px-4 py-2"
              >
                Роль: {filterRole === 'all' ? 'Все' : filterRole === 'admin' ? 'Администратор' : 'Пользователь'}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#23263B] border-[#483194]/25 shadow-xl z-[60] min-w-[160px] text-white">
              <DropdownMenuItem onClick={() => setFilterRole('all')}>
                <Check className={`h-4 w-4 mr-2 ${filterRole === 'all' ? 'opacity-100 text-[#8B5CF6]' : 'opacity-0'}`} />
                Все
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRole('user')}>
                <Check className={`h-4 w-4 mr-2 ${filterRole === 'user' ? 'opacity-100 text-[#36CFFF]' : 'opacity-0'}`} />
                Пользователь
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRole('admin')}>
                <Check className={`h-4 w-4 mr-2 ${filterRole === 'admin' ? 'opacity-100 text-[#ff5555]' : 'opacity-0'}`} />
                Администратор
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {truncated && (
        <p className="mb-4 text-sm text-[#b2b6cf]">
          Показаны последние {PROFILES_LIMIT} зарегистрированных профилей — поиск идёт только по ним.
        </p>
      )}

      <div className="overflow-x-auto rounded-2xl bg-[#191B22] border border-[#23263B]/40 shadow-xl">
        <table className="w-full rounded-2xl overflow-hidden">
          <thead>
            <tr className="border-b border-[#28213a] bg-gradient-to-r from-[#23263B]/90 to-[#1A1F2C]/95">
              <th className="text-left py-4 px-5 font-bold text-lg text-gradient bg-gradient-to-r from-[#9b87f5] via-[#8B5CF6] to-[#0EA5E9] bg-clip-text text-transparent">Пользователь</th>
              <th className="text-left py-4 px-5 font-bold text-lg text-[#FF81C0]">Роль</th>
              <th className="text-left py-4 px-5 font-bold text-lg text-[#82FFD7]">Дата регистрации</th>
              <th className="text-left py-4 px-5 font-bold text-lg text-white">Действия</th>
            </tr>
          </thead>
          <tbody className="bg-[#191B22]/95">
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-b border-[#23263B]/60 hover:bg-[#23263B]/80 transition-colors duration-100">
                <td className="py-5 px-5">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback className="bg-[#23263B] text-[#8B5CF6]">
                        <UserRound className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold text-white">{user.full_name || 'Без имени'}</div>
                      <div className="text-xs text-[#b2b6cf]">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-5">
                  <Badge className={getPlanColor(user.role) + " rounded text-xs px-2 py-1"}>
                    {roleText(user.role)}
                  </Badge>
                </td>
                <td className="py-5 px-5 text-[#bddfff] text-base">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString('ru-RU') : '—'}
                </td>
                <td className="py-5 px-5">
                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="bg-[#23263B] hover:bg-[#2d2e3b] text-[#8B5CF6] rounded-md">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-[#23263B] border-[#483194]/25 shadow-xl text-white">
                        <DropdownMenuItem
                          onClick={() => updateUserRole(user, user.role === 'admin' ? 'user' : 'admin')}
                        >
                          {user.role === 'admin' ? 'Убрать админа' : 'Сделать админом'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-[#b2b6cf]">
            {users.length === 0 ? 'Пользователи не найдены' : 'Нет пользователей, соответствующих фильтрам'}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
