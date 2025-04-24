
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  Server, 
  Settings, 
  Search, 
  Plus, 
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  Download,
  Trash2
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Мок-данные сайтов
const mockSites = Array(10).fill(null).map((_, i) => ({
  id: `site-${i}`,
  url: `https://example${i}.com`,
  name: `Сайт ${i + 1}`,
  status: ['active', 'pending', 'error'][Math.floor(Math.random() * 3)],
  lastAudit: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
  seoScore: Math.floor(Math.random() * 100),
  owner: ['Иван Иванов', 'Мария Петрова', 'Алексей Сидоров'][Math.floor(Math.random() * 3)]
}));

const AdminSiteManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  const filteredSites = mockSites.filter(site => {
    const matchesSearch = 
      site.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || site.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active': return <Badge variant="default" className="bg-green-500">Активен</Badge>;
      case 'pending': return <Badge variant="secondary">В обработке</Badge>;
      case 'error': return <Badge variant="destructive">Ошибка</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="container mx-auto py-10 max-w-6xl">
      <div className="mb-8 px-6 py-8 rounded-3xl bg-gradient-to-br from-blue-600/20 via-purple-500/20 to-indigo-600/20 flex items-center gap-6 border border-primary/20 shadow-2xl">
        <div className="bg-primary/20 text-primary rounded-full p-5 shadow-lg">
          <Globe className="h-10 w-10" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gradient-primary">Управление сайтами</h1>
          <div className="flex gap-4 text-muted-foreground">
            <Server className="h-5 w-5" /> Мониторинг
            <Settings className="h-5 w-5" /> Настройка
            <Globe className="h-5 w-5" /> Оптимизация
          </div>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по сайтам..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-[250px]"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="active">Активные</SelectItem>
                  <SelectItem value="pending">В обработке</SelectItem>
                  <SelectItem value="error">С ошибками</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" /> Фильтры
              </Button>
              
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Добавить сайт
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">Все сайты</TabsTrigger>
              <TabsTrigger value="my">Мои сайты</TabsTrigger>
              <TabsTrigger value="optimized">Оптимизированные</TabsTrigger>
              <TabsTrigger value="pending">Ожидающие</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Название</th>
                      <th className="text-left py-3 px-4 font-medium">URL</th>
                      <th className="text-left py-3 px-4 font-medium">Статус</th>
                      <th className="text-left py-3 px-4 font-medium">Последний аудит</th>
                      <th className="text-left py-3 px-4 font-medium">SEO оценка</th>
                      <th className="text-left py-3 px-4 font-medium">Владелец</th>
                      <th className="text-left py-3 px-4 font-medium">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSites.map(site => (
                      <tr key={site.id} className="border-b hover:bg-muted/50">
                        <td className="py-4 px-4 font-medium">{site.name}</td>
                        <td className="py-4 px-4">
                          <a 
                            href={site.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-primary hover:underline"
                          >
                            {site.url}
                            <ArrowUpRight className="h-3 w-3" />
                          </a>
                        </td>
                        <td className="py-4 px-4">{getStatusBadge(site.status)}</td>
                        <td className="py-4 px-4">
                          {new Date(site.lastAudit).toLocaleDateString('ru-RU')}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`font-bold ${getScoreColor(site.seoScore)}`}>
                            {site.seoScore}/100
                          </span>
                        </td>
                        <td className="py-4 px-4">{site.owner}</td>
                        <td className="py-4 px-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Действия</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Действия</DropdownMenuLabel>
                              <DropdownMenuItem>Редактировать</DropdownMenuItem>
                              <DropdownMenuItem>Запустить аудит</DropdownMenuItem>
                              <DropdownMenuItem>Оптимизировать</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-500">Удалить</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="my">
              <div className="flex flex-col items-center justify-center p-10 bg-muted/50 rounded-lg">
                <Globe className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Мои сайты</h3>
                <p className="text-center text-muted-foreground mb-4">
                  Здесь будут отображаться сайты, которыми вы управляете.
                </p>
                <Button>Добавить сайт</Button>
              </div>
            </TabsContent>

            <TabsContent value="optimized">
              <div className="flex flex-col items-center justify-center p-10 bg-muted/50 rounded-lg">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">Оптимизированные сайты</h3>
                <p className="text-center text-muted-foreground mb-4">
                  Здесь будут отображаться сайты, прошедшие оптимизацию.
                </p>
                <Button>Просмотреть отчеты</Button>
              </div>
            </TabsContent>

            <TabsContent value="pending">
              <div className="flex flex-col items-center justify-center p-10 bg-muted/50 rounded-lg">
                <Clock className="h-16 w-16 text-amber-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">Ожидающие сайты</h3>
                <p className="text-center text-muted-foreground mb-4">
                  Здесь будут отображаться сайты, ожидающие проверки или оптимизации.
                </p>
                <Button>Проверить статус</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Массовые действия</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle className="h-4 w-4 mr-2" /> Запустить аудит для выбранных
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" /> Оптимизировать выбранные
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" /> Экспортировать данные
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="w-full justify-start text-red-500">
                  <Trash2 className="h-4 w-4 mr-2" /> Удалить выбранные
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Статистика сайтов</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Всего сайтов:</span>
                <Badge variant="outline" className="text-base">{mockSites.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Активных:</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-500">{mockSites.filter(s => s.status === 'active').length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>В обработке:</span>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500">{mockSites.filter(s => s.status === 'pending').length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>С ошибками:</span>
                <Badge variant="outline" className="bg-red-500/10 text-red-500">{mockSites.filter(s => s.status === 'error').length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Средний SEO-скор:</span>
                <Badge variant="outline" className="text-primary">{Math.round(mockSites.reduce((acc, site) => acc + site.seoScore, 0) / mockSites.length)}/100</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Управление SEO-оптимизацией</h3>
          <p className="text-muted-foreground mb-4">
            Настройте параметры оптимизации для всех сайтов или отдельных групп.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Параметры аудита</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Настройте глубину и объем проверок сайтов.
              </p>
              <Button variant="outline" className="w-full">Настроить</Button>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Расписание проверок</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Установите периодичность сканирования сайтов.
              </p>
              <Button variant="outline" className="w-full">Настроить</Button>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Шаблоны оптимизации</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Создайте шаблоны оптимизации для разных категорий.
              </p>
              <Button variant="outline" className="w-full">Настроить</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSiteManagementPage;
