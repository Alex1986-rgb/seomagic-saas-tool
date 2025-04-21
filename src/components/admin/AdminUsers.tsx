
import React, { useState } from 'react';
import { Check, ChevronDown, Edit, Trash, UserRound, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import UserStatsCards from "./UserStatsCards";
import UserCharts from "./UserCharts";

// Мок-данные пользователей
const mockUsers = [
  {
    id: '1',
    name: 'Иван Петров',
    email: 'ivan@example.com',
    role: 'admin',
    plan: 'pro',
    audits: 28,
    joined: '2023-01-15',
    avatar: '',
  },
  {
    id: '2',
    name: 'Анна Сидорова',
    email: 'anna@example.com',
    role: 'user',
    plan: 'basic',
    audits: 12,
    joined: '2023-03-10',
    avatar: '',
  },
  {
    id: '3',
    name: 'Петр Иванов',
    email: 'petr@example.com',
    role: 'user',
    plan: 'free',
    audits: 4,
    joined: '2023-05-22',
    avatar: '',
  },
  {
    id: '4',
    name: 'Ольга Смирнова',
    email: 'olga@example.com',
    role: 'user',
    plan: 'pro',
    audits: 32,
    joined: '2023-02-08',
    avatar: '',
  },
  {
    id: '5',
    name: 'Алексей Козлов',
    email: 'alex@example.com',
    role: 'user',
    plan: 'basic',
    audits: 8,
    joined: '2023-04-15',
    avatar: '',
  },
];

const AdminUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const [filterRole, setFilterRole] = useState('all');

  // Фильтрация пользователей
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPlan = filterPlan === 'all' || user.plan === filterPlan;
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesPlan && matchesRole;
  });

  const getPlanColor = (plan) => {
    switch(plan) {
      case 'free': return 'bg-[#23263B]/70 text-[#36CFFF] border border-[#36CFFF]/20';
      case 'basic': return 'bg-[#1A2239]/70 text-[#14CC8C] border border-[#14CC8C]/20';
      case 'pro': return 'bg-[#28213a]/70 text-[#8B5CF6] border border-[#8B5CF6]/30';
      default: return 'bg-[#23263B]/70 text-white border border-[#483194]/10';
    }
  };

  return (
    <div>
      {/* ... убираем дублирующий вывод UserStatsCards, UserCharts ... */}

      {/* Фильтры / Поиск / Добавить */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск пользователей..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#23263B]/80 border border-[#222644] placeholder:text-[#b2b6cf] text-white focus:border-[#8B5CF6]/60 transition-all"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center bg-[#23263B]/80 text-white border border-[#383a50]/60 hover:bg-[#1A1F2C]/90 transition-all"
              >
                Тариф: {filterPlan === 'all' ? 'Все' : filterPlan}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#23263B] border-[#483194]/25 shadow-xl z-[60] min-w-[160px] text-white">
              <DropdownMenuItem onClick={() => setFilterPlan('all')}>
                <Check className={`h-4 w-4 mr-2 ${filterPlan === 'all' ? 'opacity-100 text-[#8B5CF6]' : 'opacity-0'}`} />
                Все
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPlan('free')}>
                <Check className={`h-4 w-4 mr-2 ${filterPlan === 'free' ? 'opacity-100 text-[#36CFFF]' : 'opacity-0'}`} />
                Бесплатный
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPlan('basic')}>
                <Check className={`h-4 w-4 mr-2 ${filterPlan === 'basic' ? 'opacity-100 text-[#14CC8C]' : 'opacity-0'}`} />
                Базовый
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPlan('pro')}>
                <Check className={`h-4 w-4 mr-2 ${filterPlan === 'pro' ? 'opacity-100 text-[#8B5CF6]' : 'opacity-0'}`} />
                Про
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center bg-[#23263B]/80 text-white border border-[#383a50]/60 hover:bg-[#1A1F2C]/90 transition-all"
              >
                Роль: {filterRole === 'all' ? 'Все' : filterRole}
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
          
          <Button className="whitespace-nowrap bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] text-white shadow-lg border-none hover:scale-[1.04] transition-transform duration-150">
            Добавить пользователя
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full rounded-2xl overflow-hidden">
          <thead>
            <tr className="border-b border-[#28213a] bg-gradient-to-r from-[#23263B]/90 to-[#1A1F2C]/95">
              <th className="text-left py-3 px-4 font-medium text-[#8B5CF6]">Пользователь</th>
              <th className="text-left py-3 px-4 font-medium text-[#36CFFF]">Тариф</th>
              <th className="text-left py-3 px-4 font-medium text-[#FF81C0]">Роль</th>
              <th className="text-left py-3 px-4 font-medium text-[#F6C778]">Аудитов</th>
              <th className="text-left py-3 px-4 font-medium text-[#82FFD7]">Дата регистрации</th>
              <th className="text-left py-3 px-4 font-medium text-white">Действия</th>
            </tr>
          </thead>
          <tbody className="bg-[#191B22]/95">
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-b border-[#23263B]/60 hover:bg-[#23263B]/60 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-[#23263B] text-[#8B5CF6]">
                        <UserRound className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-white">{user.name}</div>
                      <div className="text-xs text-[#b2b6cf]">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <Badge className={getPlanColor(user.plan) + " rounded text-xs px-2 py-1"}>
                    {user.plan === 'free' && 'Бесплатный'}
                    {user.plan === 'basic' && 'Базовый'}
                    {user.plan === 'pro' && 'Про'}
                  </Badge>
                </td>
                <td className="py-4 px-4">
                  <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'} className={user.role === 'admin' ? 'bg-[#FF3355]/80 text-white border-none' : 'bg-[#191B22]/80 text-[#36CFFF] border border-[#36CFFF]/20 text-xs'}>
                    {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                  </Badge>
                </td>
                <td className="py-4 px-4 text-[#DED6F6]">{user.audits}</td>
                <td className="py-4 px-4 text-[#bddfff]">
                  {new Date(user.joined).toLocaleDateString('ru-RU')}
                </td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="bg-[#23263B] hover:bg-[#2d2e3b] text-[#8B5CF6]">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="bg-[#23263B] hover:bg-[#2d2e3b] text-[#F97316]">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
