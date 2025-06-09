
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Bell, Shield, CreditCard, Download, Camera, Edit3, Save, X } from 'lucide-react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Иван Петров',
    email: 'ivan.petrov@example.com',
    company: 'ООО "Техно Решения"',
    position: 'SEO-специалист',
    phone: '+7 (900) 123-45-67',
    bio: 'Опытный SEO-специалист с более чем 5-летним стажем. Специализируюсь на технической оптимизации и продвижении корпоративных сайтов.',
    website: 'https://techno-solutions.ru'
  });

  const [notifications, setNotifications] = useState({
    emailReports: true,
    pushNotifications: false,
    weeklyDigest: true,
    criticalAlerts: true
  });

  const handleSave = () => {
    setIsEditing(false);
    // Здесь была бы логика сохранения данных
  };

  const stats = [
    { label: 'Проведено аудитов', value: 47, color: 'text-blue-600' },
    { label: 'Сайтов в мониторинге', value: 12, color: 'text-green-600' },
    { label: 'Исправленных ошибок', value: 234, color: 'text-purple-600' },
    { label: 'Рост позиций', value: '+38%', color: 'text-orange-600' }
  ];

  const recentActivity = [
    { action: 'Проведен аудит сайта', site: 'example.com', time: '2 часа назад', status: 'success' },
    { action: 'Обновлены позиции', site: 'mystore.ru', time: '1 день назад', status: 'info' },
    { action: 'Найдены критические ошибки', site: 'business.net', time: '2 дня назад', status: 'warning' },
    { action: 'Завершена оптимизация', site: 'shop.org', time: '3 дня назад', status: 'success' }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Шапка профиля */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10" />
            <CardContent className="relative p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="Профиль" />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      ИП
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold">{profileData.name}</h1>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-700 border-green-200">
                      Pro план
                    </Badge>
                  </div>
                  <p className="text-lg text-muted-foreground mb-1">{profileData.position}</p>
                  <p className="text-muted-foreground mb-4">{profileData.company}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={isEditing ? "destructive" : "default"}
                      onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
                      className="gap-2"
                    >
                      {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                      {isEditing ? 'Отменить' : 'Редактировать'}
                    </Button>
                    {isEditing && (
                      <Button onClick={handleSave} className="gap-2">
                        <Save className="h-4 w-4" />
                        Сохранить
                      </Button>
                    )}
                    <Button variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Экспорт данных
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Статистика */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-4">
                <div className={`text-2xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Основной контент */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Профиль
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Настройки
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Уведомления
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Безопасность
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Личная информация</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Имя и фамилия</Label>
                      <Input 
                        id="name" 
                        value={profileData.name}
                        readOnly={!isEditing}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className={!isEditing ? 'bg-muted' : ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={profileData.email}
                        readOnly={!isEditing}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className={!isEditing ? 'bg-muted' : ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Компания</Label>
                      <Input 
                        id="company" 
                        value={profileData.company}
                        readOnly={!isEditing}
                        onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                        className={!isEditing ? 'bg-muted' : ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Должность</Label>
                      <Input 
                        id="position" 
                        value={profileData.position}
                        readOnly={!isEditing}
                        onChange={(e) => setProfileData({...profileData, position: e.target.value})}
                        className={!isEditing ? 'bg-muted' : ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон</Label>
                      <Input 
                        id="phone" 
                        value={profileData.phone}
                        readOnly={!isEditing}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className={!isEditing ? 'bg-muted' : ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Веб-сайт</Label>
                      <Input 
                        id="website" 
                        value={profileData.website}
                        readOnly={!isEditing}
                        onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                        className={!isEditing ? 'bg-muted' : ''}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">О себе</Label>
                    <Textarea 
                      id="bio" 
                      rows={4}
                      value={profileData.bio}
                      readOnly={!isEditing}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      className={!isEditing ? 'bg-muted' : ''}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Последняя активность</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.site}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">{activity.time}</p>
                          <Badge variant={
                            activity.status === 'success' ? 'default' :
                            activity.status === 'warning' ? 'destructive' : 'secondary'
                          }>
                            {activity.status === 'success' ? 'Успешно' :
                             activity.status === 'warning' ? 'Внимание' : 'Информация'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Настройки аккаунта</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Подписка</h3>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Pro план</p>
                        <p className="text-sm text-muted-foreground">Безлимитные аудиты и мониторинг</p>
                      </div>
                      <Button variant="outline">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Управление
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Использование ресурсов</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Аудиты в этом месяце</span>
                          <span>47/100</span>
                        </div>
                        <Progress value={47} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Отслеживаемые ключевые слова</span>
                          <span>234/500</span>
                        </div>
                        <Progress value={47} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Настройки уведомлений</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email отчеты</p>
                      <p className="text-sm text-muted-foreground">Получать отчеты на email</p>
                    </div>
                    <Switch 
                      checked={notifications.emailReports}
                      onCheckedChange={(checked) => setNotifications({...notifications, emailReports: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push уведомления</p>
                      <p className="text-sm text-muted-foreground">Уведомления в браузере</p>
                    </div>
                    <Switch 
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) => setNotifications({...notifications, pushNotifications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Еженедельная сводка</p>
                      <p className="text-sm text-muted-foreground">Сводный отчет раз в неделю</p>
                    </div>
                    <Switch 
                      checked={notifications.weeklyDigest}
                      onCheckedChange={(checked) => setNotifications({...notifications, weeklyDigest: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Критические уведомления</p>
                      <p className="text-sm text-muted-foreground">Уведомления о критических проблемах</p>
                    </div>
                    <Switch 
                      checked={notifications.criticalAlerts}
                      onCheckedChange={(checked) => setNotifications({...notifications, criticalAlerts: checked})}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Безопасность аккаунта</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                      <div className="font-medium mb-1">Изменить пароль</div>
                      <div className="text-sm text-muted-foreground">Обновить пароль аккаунта</div>
                    </Button>
                    
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                      <div className="font-medium mb-1">Двухфакторная аутентификация</div>
                      <div className="text-sm text-muted-foreground">Добавить дополнительную защиту</div>
                    </Button>
                    
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                      <div className="font-medium mb-1">История входов</div>
                      <div className="text-sm text-muted-foreground">Просмотреть активность аккаунта</div>
                    </Button>
                    
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                      <div className="font-medium mb-1">Экспорт данных</div>
                      <div className="text-sm text-muted-foreground">Скачать все ваши данные</div>
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-800 mb-2">Опасная зона</h4>
                    <p className="text-sm text-red-600 mb-4">Эти действия нельзя отменить</p>
                    <Button variant="destructive">Удалить аккаунт</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Profile;
