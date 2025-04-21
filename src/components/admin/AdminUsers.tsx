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
      case 'free': return 'bg-blue-500';
      case 'basic': return 'bg-green-500';
      case 'pro': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div>
      {/* Добавлены карточки и графики */}
      <UserStatsCards />
      <UserCharts />

      {/* ... keep existing code (search, filters, user table) ... */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск пользователей..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                Тариф: {filterPlan === 'all' ? 'Все' : filterPlan}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterPlan('all')}>
                <Check className={`h-4 w-4 mr-2 ${filterPlan === 'all' ? 'opacity-100' : 'opacity-0'}`} />
                Все
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPlan('free')}>
                <Check className={`h-4 w-4 mr-2 ${filterPlan === 'free' ? 'opacity-100' : 'opacity-0'}`} />
                Бесплатный
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPlan('basic')}>
                <Check className={`h-4 w-4 mr-2 ${filterPlan === 'basic' ? 'opacity-100' : 'opacity-0'}`} />
                Базовый
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterPlan('pro')}>
                <Check className={`h-4 w-4 mr-2 ${filterPlan === 'pro' ? 'opacity-100' : 'opacity-0'}`} />
                Про
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                Роль: {filterRole === 'all' ? 'Все' : filterRole}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterRole('all')}>
                <Check className={`h-4 w-4 mr-2 ${filterRole === 'all' ? 'opacity-100' : 'opacity-0'}`} />
                Все
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRole('user')}>
                <Check className={`h-4 w-4 mr-2 ${filterRole === 'user' ? 'opacity-100' : 'opacity-0'}`} />
                Пользователь
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRole('admin')}>
                <Check className={`h-4 w-4 mr-2 ${filterRole === 'admin' ? 'opacity-100' : 'opacity-0'}`} />
                Администратор
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button className="whitespace-nowrap">
            Добавить пользователя
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium">Пользователь</th>
              <th className="text-left py-3 px-4 font-medium">Тариф</th>
              <th className="text-left py-3 px-4 font-medium">Роль</th>
              <th className="text-left py-3 px-4 font-medium">Аудитов</th>
              <th className="text-left py-3 px-4 font-medium">Дата регистрации</th>
              <th className="text-left py-3 px-4 font-medium">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-b">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>
                        <UserRound className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <Badge className={getPlanColor(user.plan)}>
                    {user.plan === 'free' && 'Бесплатный'}
                    {user.plan === 'basic' && 'Базовый'}
                    {user.plan === 'pro' && 'Про'}
                  </Badge>
                </td>
                <td className="py-4 px-4">
                  <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                    {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                  </Badge>
                </td>
                <td className="py-4 px-4">{user.audits}</td>
                <td className="py-4 px-4">
                  {new Date(user.joined).toLocaleDateString('ru-RU')}
                </td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
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
