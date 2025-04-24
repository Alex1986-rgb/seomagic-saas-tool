
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, Search, Filter, Download, Trash2 } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Мок-данные для логов
const mockSystemLogs = Array(20).fill(null).map((_, i) => ({
  id: `log-${i}`,
  timestamp: new Date(Date.now() - Math.random() * 86400000 * 5).toISOString(),
  level: ['info', 'warning', 'error'][Math.floor(Math.random() * 3)],
  message: [
    'Система успешно запущена',
    'Выполнено обновление настроек',
    'Ошибка соединения с базой данных',
    'Пользователь авторизован',
    'Аудит завершен с ошибкой',
    'API недоступен',
    'Выполнена оптимизация сайта',
    'Превышен лимит запросов'
  ][Math.floor(Math.random() * 8)],
  source: ['system', 'api', 'user', 'database'][Math.floor(Math.random() * 4)]
}));

const mockUserLogs = Array(20).fill(null).map((_, i) => ({
  id: `user-log-${i}`,
  timestamp: new Date(Date.now() - Math.random() * 86400000 * 5).toISOString(),
  user: [
    'admin@example.com', 
    'manager@example.com', 
    'user@example.com',
    'support@example.com'
  ][Math.floor(Math.random() * 4)],
  action: [
    'login', 
    'logout', 
    'create_audit', 
    'delete_user', 
    'edit_settings',
    'create_site',
    'view_stats'
  ][Math.floor(Math.random() * 7)],
  details: 'Дополнительная информация о действии пользователя',
  ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
}));

const AdminLogsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('system');
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');

  const filteredSystemLogs = mockSystemLogs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const filteredUserLogs = mockUserLogs.filter(log => {
    return log.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
           log.action.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getLevelBadge = (level: string) => {
    switch(level) {
      case 'info': return <Badge variant="default">Инфо</Badge>;
      case 'warning': return <Badge variant="warning" className="bg-yellow-500">Предупреждение</Badge>;
      case 'error': return <Badge variant="destructive">Ошибка</Badge>;
      default: return <Badge>{level}</Badge>;
    }
  };

  const getActionBadge = (action: string) => {
    switch(action) {
      case 'login': return <Badge variant="outline" className="border-green-500 text-green-500">Вход</Badge>;
      case 'logout': return <Badge variant="outline" className="border-blue-500 text-blue-500">Выход</Badge>;
      case 'create_audit': return <Badge variant="outline" className="border-purple-500 text-purple-500">Создание аудита</Badge>;
      case 'delete_user': return <Badge variant="outline" className="border-red-500 text-red-500">Удаление пользователя</Badge>;
      case 'edit_settings': return <Badge variant="outline" className="border-amber-500 text-amber-500">Изменение настроек</Badge>;
      default: return <Badge variant="outline">{action}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-6xl">
      <div className="mb-8 px-6 py-8 rounded-3xl bg-gradient-to-br from-indigo-600/20 via-purple-500/20 to-blue-600/20 flex items-center gap-6 border border-primary/20 shadow-2xl">
        <div className="bg-primary/20 text-primary rounded-full p-5 shadow-lg">
          <Clock className="h-10 w-10" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gradient-primary">Логи системы</h1>
          <p className="text-muted-foreground">
            Мониторинг событий и действий пользователей на платформе
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <TabsList>
                <TabsTrigger value="system">Системные логи</TabsTrigger>
                <TabsTrigger value="user">Действия пользователей</TabsTrigger>
                <TabsTrigger value="audit">Аудиты</TabsTrigger>
                <TabsTrigger value="api">API</TabsTrigger>
              </TabsList>
              
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Поиск в логах..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-[250px]"
                  />
                </div>
                
                {activeTab === 'system' && (
                  <Select value={levelFilter} onValueChange={setLevelFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Уровень лога" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все уровни</SelectItem>
                      <SelectItem value="info">Информация</SelectItem>
                      <SelectItem value="warning">Предупреждения</SelectItem>
                      <SelectItem value="error">Ошибки</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" /> Фильтры
                </Button>
                
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" /> Экспорт
                </Button>
              </div>
            </div>

            <TabsContent value="system">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">ID</th>
                      <th className="text-left py-3 px-4 font-medium">Дата и время</th>
                      <th className="text-left py-3 px-4 font-medium">Уровень</th>
                      <th className="text-left py-3 px-4 font-medium">Сообщение</th>
                      <th className="text-left py-3 px-4 font-medium">Источник</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSystemLogs.map(log => (
                      <tr key={log.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-mono text-xs">{log.id}</td>
                        <td className="py-3 px-4 text-sm">
                          {new Date(log.timestamp).toLocaleString('ru-RU')}
                        </td>
                        <td className="py-3 px-4">{getLevelBadge(log.level)}</td>
                        <td className="py-3 px-4">{log.message}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{log.source}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="user">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Дата и время</th>
                      <th className="text-left py-3 px-4 font-medium">Пользователь</th>
                      <th className="text-left py-3 px-4 font-medium">Действие</th>
                      <th className="text-left py-3 px-4 font-medium">IP-адрес</th>
                      <th className="text-left py-3 px-4 font-medium">Подробности</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUserLogs.map(log => (
                      <tr key={log.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 text-sm">
                          {new Date(log.timestamp).toLocaleString('ru-RU')}
                        </td>
                        <td className="py-3 px-4">{log.user}</td>
                        <td className="py-3 px-4">
                          {getActionBadge(log.action)}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs">{log.ip}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {log.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="audit">
              <div className="flex flex-col items-center justify-center p-10 bg-muted/50 rounded-lg">
                <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Логи аудитов</h3>
                <p className="text-center text-muted-foreground mb-4">
                  Этот раздел позволяет просматривать детальные журналы аудитов сайтов и их результаты.
                </p>
                <Button>Загрузить журнал аудитов</Button>
              </div>
            </TabsContent>

            <TabsContent value="api">
              <div className="flex flex-col items-center justify-center p-10 bg-muted/50 rounded-lg">
                <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Логи API</h3>
                <p className="text-center text-muted-foreground mb-4">
                  Этот раздел содержит журналы обращений к API платформы, включая успешные запросы и ошибки.
                </p>
                <Button>Загрузить журнал API</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Управление логами</h3>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" /> Экспорт всех логов
              </Button>
              <Button variant="outline" className="gap-2 text-red-500">
                <Trash2 className="h-4 w-4" /> Очистить старые логи
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Настройки хранения</h4>
              <p className="text-sm text-muted-foreground">
                Логи хранятся 30 дней, затем автоматически архивируются.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Уведомления</h4>
              <p className="text-sm text-muted-foreground">
                Настройте оповещения о критических событиях в системе.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Аналитика логов</h4>
              <p className="text-sm text-muted-foreground">
                Анализ трендов и аномалий в работе системы.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogsPage;
