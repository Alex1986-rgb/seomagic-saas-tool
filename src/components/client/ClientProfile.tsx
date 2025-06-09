
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Shield, BarChart3, Bell, CreditCard, LogOut, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

const ClientProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'Иван Петров',
    email: 'ivan.petrov@example.com',
    phone: '+7 (999) 123-45-67',
    company: 'ООО "Технологии"',
    position: 'SEO-специалист'
  });

  const [editData, setEditData] = useState(userData);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(userData);
  };

  const handleSave = () => {
    setUserData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Личный кабинет
              </h1>
              <p className="text-muted-foreground mt-2">
                Управляйте своим профилем и настройками
              </p>
            </div>
            <Badge variant="secondary" className="px-4 py-2">
              Активный пользователь
            </Badge>
          </div>
        </motion.div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-card border">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User size={16} />
              Профиль
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 size={16} />
              Статистика
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell size={16} />
              Уведомления
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard size={16} />
              Подписка
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield size={16} />
              Безопасность
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {userData.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl">{userData.name}</h3>
                      <p className="text-sm text-muted-foreground">{userData.position}</p>
                    </div>
                  </CardTitle>
                </div>
                {!isEditing ? (
                  <Button onClick={handleEdit} variant="outline" size="sm">
                    <Edit2 size={16} className="mr-2" />
                    Редактировать
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm">
                      <Save size={16} className="mr-2" />
                      Сохранить
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="sm">
                      <X size={16} className="mr-2" />
                      Отмена
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Полное имя</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      />
                    ) : (
                      <p className="py-2 px-3 bg-muted/50 rounded-md">{userData.name}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      />
                    ) : (
                      <p className="py-2 px-3 bg-muted/50 rounded-md">{userData.email}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      />
                    ) : (
                      <p className="py-2 px-3 bg-muted/50 rounded-md">{userData.phone}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Компания</Label>
                    {isEditing ? (
                      <Input
                        id="company"
                        value={editData.company}
                        onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                      />
                    ) : (
                      <p className="py-2 px-3 bg-muted/50 rounded-md">{userData.company}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Проведено аудитов</p>
                      <p className="text-2xl font-bold text-primary">47</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-primary/60" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Отслеживаемых сайтов</p>
                      <p className="text-2xl font-bold text-primary">12</p>
                    </div>
                    <User className="h-8 w-8 text-primary/60" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Средний SEO балл</p>
                      <p className="text-2xl font-bold text-primary">87</p>
                    </div>
                    <Settings className="h-8 w-8 text-primary/60" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Настройки уведомлений</CardTitle>
                <CardDescription>
                  Управляйте способами получения уведомлений
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email уведомления</Label>
                    <p className="text-sm text-muted-foreground">Получать уведомления на email</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS уведомления</Label>
                    <p className="text-sm text-muted-foreground">Получать SMS о важных событиях</p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push уведомления</Label>
                    <p className="text-sm text-muted-foreground">Показывать уведомления в браузере</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Текущая подписка</CardTitle>
                <CardDescription>
                  Управление подпиской и способами оплаты
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                  <div>
                    <h4 className="font-semibold">Профессиональный план</h4>
                    <p className="text-sm text-muted-foreground">2900 ₽/месяц</p>
                  </div>
                  <Badge variant="secondary">Активна</Badge>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Следующее списание: 15 января 2025</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Безопасность аккаунта</CardTitle>
                <CardDescription>
                  Настройки безопасности и конфиденциальности
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="current-password">Текущий пароль</Label>
                  <Input id="current-password" type="password" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="new-password">Новый пароль</Label>
                  <Input id="new-password" type="password" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="confirm-password">Подтвердите пароль</Label>
                  <Input id="confirm-password" type="password" className="mt-2" />
                </div>
                <Button>Обновить пароль</Button>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Двухфакторная аутентификация</Label>
                    <p className="text-sm text-muted-foreground">Дополнительная защита аккаунта</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientProfile;
