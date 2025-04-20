
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Users, UserPlus, UserMinus, Edit, Trash, Save } from 'lucide-react';

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
};

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([
    { id: '1', name: 'Администратор', email: 'admin@example.com', role: 'Супер-админ', isActive: true },
    { id: '2', name: 'Модератор', email: 'moderator@example.com', role: 'Модератор', isActive: true },
    { id: '3', name: 'Аналитик', email: 'analyst@example.com', role: 'Аналитик', isActive: false },
  ]);
  
  const [editing, setEditing] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Модератор',
    password: ''
  });
  
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    
    const user: AdminUser = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      isActive: true
    };
    
    setUsers([...users, user]);
    setNewUser({ name: '', email: '', role: 'Модератор', password: '' });
  };
  
  const handleToggleStatus = (id: string) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, isActive: !user.isActive } : user
    ));
  };
  
  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
  };
  
  const handleEditUser = (id: string) => {
    setEditing(id);
  };
  
  const handleSaveUser = (id: string) => {
    setEditing(null);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center mb-6 space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Управление пользователями системы</h3>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md bg-muted/20">
              <div className="space-y-2">
                <Label htmlFor="new-name">Имя</Label>
                <Input 
                  id="new-name" 
                  value={newUser.name}
                  onChange={e => setNewUser({...newUser, name: e.target.value})}
                  placeholder="Введите имя"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-email">Email</Label>
                <Input 
                  id="new-email" 
                  type="email"
                  value={newUser.email}
                  onChange={e => setNewUser({...newUser, email: e.target.value})}
                  placeholder="Введите email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-role">Роль</Label>
                <select 
                  id="new-role"
                  value={newUser.role}
                  onChange={e => setNewUser({...newUser, role: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option>Супер-админ</option>
                  <option>Модератор</option>
                  <option>Аналитик</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">Пароль</Label>
                <Input 
                  id="new-password" 
                  type="password"
                  value={newUser.password}
                  onChange={e => setNewUser({...newUser, password: e.target.value})}
                  placeholder="Введите пароль"
                />
              </div>
              
              <div className="md:col-span-2 flex justify-end pt-2">
                <Button
                  onClick={handleAddUser}
                  className="gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Добавить пользователя
                </Button>
              </div>
            </div>
            
            <div className="border rounded-md">
              <div className="grid grid-cols-5 gap-2 p-3 font-medium bg-muted/30 border-b">
                <div className="col-span-2">Пользователь</div>
                <div>Роль</div>
                <div>Статус</div>
                <div>Действия</div>
              </div>
              
              {users.map(user => (
                <div key={user.id} className="grid grid-cols-5 gap-2 p-3 border-b last:border-0 items-center">
                  <div className="col-span-2">
                    {editing === user.id ? (
                      <Input defaultValue={user.name} className="mb-1" />
                    ) : (
                      <div>
                        <div>{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    {editing === user.id ? (
                      <select 
                        defaultValue={user.role}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                      >
                        <option>Супер-админ</option>
                        <option>Модератор</option>
                        <option>Аналитик</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={user.isActive} 
                        onCheckedChange={() => handleToggleStatus(user.id)}
                      />
                      <Label>{user.isActive ? 'Активен' : 'Не активен'}</Label>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {editing === user.id ? (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleSaveUser(user.id)}
                        className="gap-1"
                      >
                        <Save className="h-4 w-4" />
                        <span className="sr-only md:not-sr-only md:inline-block">Сохранить</span>
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditUser(user.id)}
                        className="gap-1"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only md:not-sr-only md:inline-block">Изменить</span>
                      </Button>
                    )}
                    
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDeleteUser(user.id)}
                      className="gap-1"
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only md:not-sr-only md:inline-block">Удалить</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersManagement;
