
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Trash2 } from "lucide-react";
import { proxyManager } from '@/services/proxy/proxyManager';
import { Proxy } from '@/services/proxy/types';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface ProxyListProps {
  proxies: Proxy[];
}

const ProxyList: React.FC<ProxyListProps> = ({ proxies }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStatus, setFilteredStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const { toast } = useToast();

  const handleRemoveProxy = (id: string) => {
    try {
      proxyManager.removeProxy(id);
      toast({
        title: "Прокси удален",
        description: `Прокси успешно удален из списка`,
      });
    } catch (error) {
      console.error("Ошибка при удалении прокси:", error);
      toast({
        title: "Ошибка удаления",
        description: error instanceof Error ? error.message : "Неизвестная ошибка",
        variant: "destructive",
      });
    }
  };

  const handleSearch = () => {
    // The search is already reactive through the filteredProxies calculation,
    // but we can provide feedback to the user
    toast({
      title: "Поиск выполнен",
      description: searchTerm 
        ? `Найдено ${filteredProxies.length} прокси по запросу "${searchTerm}"`
        : `Показаны все ${filteredProxies.length} прокси`,
    });
  };

  const filteredProxies = proxies
    .filter(proxy => {
      // Фильтрация по статусу
      if (filteredStatus === 'active' && proxy.status !== 'active') return false;
      if (filteredStatus === 'inactive' && proxy.status === 'active') return false;
      
      // Фильтрация по поисковому запросу
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          proxy.ip.includes(searchLower) || 
          proxy.port.toString().includes(searchLower) ||
          proxy.source?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .sort((a, b) => {
      // Сортировка: активные прокси выше неактивных
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (a.status !== 'active' && b.status === 'active') return 1;
      
      // Для активных прокси сортировка по скорости
      if (a.status === 'active' && b.status === 'active' && a.speed && b.speed) {
        return a.speed - b.speed;
      }
      
      // По умолчанию сортировка по дате последней проверки
      const dateA = a.lastChecked ? new Date(a.lastChecked).getTime() : 0;
      const dateB = b.lastChecked ? new Date(b.lastChecked).getTime() : 0;
      return dateB - dateA;
    });

  return (
    <Card className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Input
              placeholder="Поиск прокси..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:w-80"
              prefix={<Search className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
          <Button 
            onClick={handleSearch}
            size="sm"
            className="whitespace-nowrap"
          >
            <Search className="h-4 w-4 mr-2" />
            Поиск прокси
          </Button>
        </div>
        
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <Button 
            variant={filteredStatus === 'all' ? 'default' : 'outline'} 
            onClick={() => setFilteredStatus('all')}
            size="sm"
          >
            Все
          </Button>
          <Button 
            variant={filteredStatus === 'active' ? 'default' : 'outline'} 
            onClick={() => setFilteredStatus('active')}
            size="sm"
          >
            Активные
          </Button>
          <Button 
            variant={filteredStatus === 'inactive' ? 'default' : 'outline'} 
            onClick={() => setFilteredStatus('inactive')}
            size="sm"
          >
            Неактивные
          </Button>
        </div>
      </div>
      
      {filteredProxies.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>IP:Port</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Скорость</TableHead>
                <TableHead>Источник</TableHead>
                <TableHead>Последняя проверка</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProxies.map((proxy) => (
                <TableRow key={proxy.id}>
                  <TableCell className="font-medium">{proxy.ip}:{proxy.port}</TableCell>
                  <TableCell>
                    {proxy.status === 'active' ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700">Активный</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700">Неактивный</Badge>
                    )}
                  </TableCell>
                  <TableCell>{proxy.speed ? `${proxy.speed} мс` : '-'}</TableCell>
                  <TableCell>{proxy.source || 'Неизвестно'}</TableCell>
                  <TableCell>
                    {proxy.lastChecked 
                      ? formatDistanceToNow(new Date(proxy.lastChecked), { addSuffix: true, locale: ru }) 
                      : 'Не проверялся'}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemoveProxy(proxy.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          {searchTerm || filteredStatus !== 'all' 
            ? 'Не найдено прокси, соответствующих заданным критериям.'
            : 'Список прокси пуст. Соберите прокси во вкладке "Управление".'}
        </div>
      )}
      
      <p className="text-xs text-muted-foreground mt-4">
        Всего отображается {filteredProxies.length} из {proxies.length} прокси
      </p>
    </Card>
  );
};

export default ProxyList;
