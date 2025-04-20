
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Users, UserPlus, Save, Search, Filter, CheckCircle, XCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Моковые данные администраторов
const MOCK_ADMINS = [
  { id: '1', name: 'Александр Иванов', email: 'alex@example.com', role: 'admin', lastLogin: '2023-10-15T09:20:43', status: 'active', avatar: '' },
  { id: '2', name: 'Мария Петрова', email: 'maria@example.com', role: 'support', lastLogin: '2023-10-14T14:45:12', status: 'active', avatar: '' },
  { id: '3', name: 'Сергей Смирнов', email: 'sergey@example.com', role: 'editor', lastLogin: '2023-10-10T11:32:05', status: 'inactive', avatar: '' },
  { id: '4', name: 'Анна Кузнецова', email: 'anna@example.com', role: 'admin', lastLogin: '2023-10-12T16:18:30', status: 'active', avatar: '' },
];

const UsersManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  // Фильтрация администраторов
  const filteredAdmins = MOCK_ADMINS.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         admin.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || admin.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });
  
  return (
    <div className="p-6 space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-[400px] mb-6">
          <TabsTrigger value="list">Список пользователей</TabsTrigger>
          <TabsTrigger value="new">Добавить пользователя</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск пользователей..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                <span>Фильтр</span>
              </Button>
              <Button onClick={() => setActiveTab('new')} className="gap-2">
                <UserPlus className="h-4 w-4" />
                <span>Добавить</span>
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Пользователь</th>
                      <th className="text-left py-3 px-4 font-medium">Роль</th>
                      <th className="text-left py-3 px-4 font-medium">Статус</th>
                      <th className="text-left py-3 px-4 font-medium">Последний вход</th>
                      <th className="text-left py-3 px-4 font-medium">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdmins.map(admin => (
                      <tr key={admin.id} className="border-b hover:bg-accent/5">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={admin.avatar} />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {admin.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{admin.name}</div>
                              <div className="text-sm text-muted-foreground">{admin.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant={admin.role === 'admin' ? 'default' : 'secondary'}>
                            {admin.role === 'admin' ? 'Администратор' : 
                            admin.role === 'support' ? 'Поддержка' : 'Редактор'}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {admin.status === 'active' ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>Активен</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-red-500" />
                                <span>Неактивен</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm">
                          {new Date(admin.lastLogin).toLocaleString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost">Редактировать</Button>
                            <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600">Удалить</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="new" className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center mb-4 space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">Добавление нового пользователя</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-name">Имя пользователя</Label>
                    <Input id="user-name" placeholder="Введите имя" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="user-email">Email</Label>
                    <Input id="user-email" type="email" placeholder="email@example.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="user-password">Пароль</Label>
                    <Input id="user-password" type="password" placeholder="Введите пароль" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="user-password-confirm">Подтверждение пароля</Label>
                    <Input id="user-password-confirm" type="password" placeholder="Подтвердите пароль" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Роль пользователя</Label>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { id: 'admin', label: 'Администратор', desc: 'Полный доступ ко всем функциям' },
                        { id: 'support', label: 'Поддержка', desc: 'Доступ к поддержке пользователей' },
                        { id: 'editor', label: 'Редактор', desc: 'Управление контентом' },
                      ].map(role => (
                        <div key={role.id} className="flex items-start space-x-2 p-3 border rounded-md hover:bg-accent/5 cursor-pointer">
                          <input
                            type="radio"
                            id={role.id}
                            name="role"
                            className="mt-1"
                          />
                          <div>
                            <Label htmlFor={role.id} className="font-medium cursor-pointer">{role.label}</Label>
                            <p className="text-sm text-muted-foreground">{role.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="user-active">Активировать аккаунт</Label>
                      <Switch id="user-active" defaultChecked />
                    </div>
                    <p className="text-sm text-muted-foreground">Пользователь сможет войти в систему сразу после создания</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setActiveTab('list')}>Отмена</Button>
                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  Сохранить
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UsersManagement;
