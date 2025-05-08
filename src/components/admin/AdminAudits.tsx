
import React, { useState } from 'react';
import { Search, Filter, FileText, ExternalLink, Download, Link, Calendar } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

// Мок-данные аудитов
const mockAudits = [
  {
    id: '1',
    url: 'https://example.com',
    user: { name: 'Иван Петров', email: 'ivan@example.com' },
    score: 78,
    date: '2023-06-08T14:30:00Z',
    status: 'completed',
  },
  {
    id: '2',
    url: 'https://coolwebsite.ru',
    user: { name: 'Анна Сидорова', email: 'anna@example.com' },
    score: 45,
    date: '2023-06-07T09:15:00Z',
    status: 'completed',
  },
  {
    id: '3',
    url: 'https://newbusiness.store',
    user: { name: 'Петр Иванов', email: 'petr@example.com' },
    score: 92,
    date: '2023-06-06T10:20:00Z',
    status: 'completed',
  },
  {
    id: '4',
    url: 'https://blog.example.com',
    user: { name: 'Ольга Смирнова', email: 'olga@example.com' },
    score: null,
    date: '2023-06-08T16:45:00Z',
    status: 'processing',
  },
  {
    id: '5',
    url: 'https://online-shop.com',
    user: { name: 'Алексей Козлов', email: 'alex@example.com' },
    score: 61,
    date: '2023-06-05T13:10:00Z',
    status: 'completed',
  },
];

const AdminAudits: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Фильтрация аудитов
  const filteredAudits = mockAudits.filter(audit => {
    const matchesSearch = 
      audit.url.toLowerCase().includes(searchTerm.toLowerCase()) || 
      audit.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || audit.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getScoreColor = (score) => {
    if (score === null) return 'text-muted-foreground';
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <Card className="p-6 bg-card/90 backdrop-blur-sm border-border">
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по URL или пользователю..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card/50 border-border"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-card/50 border-border">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="completed">Завершенные</SelectItem>
              <SelectItem value="processing">В обработке</SelectItem>
              <SelectItem value="failed">С ошибками</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="gap-2 bg-card/50 border-border">
            <Calendar className="h-4 w-4" />
            <span>Фильтр по дате</span>
          </Button>

          <Button className="gap-2">
            <FileText className="h-4 w-4" />
            <span>Экспорт</span>
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium">URL</th>
              <th className="text-left py-3 px-4 font-medium">Пользователь</th>
              <th className="text-left py-3 px-4 font-medium">SEO оценка</th>
              <th className="text-left py-3 px-4 font-medium">Дата</th>
              <th className="text-left py-3 px-4 font-medium">Статус</th>
              <th className="text-left py-3 px-4 font-medium">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredAudits.map(audit => (
              <tr key={audit.id} className="border-b border-border">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Link className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={audit.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline text-blue-400"
                    >
                      {audit.url}
                    </a>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div>
                    <div className="font-medium">{audit.user.name}</div>
                    <div className="text-sm text-muted-foreground">{audit.user.email}</div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  {audit.status === 'processing' ? (
                    <span className="text-muted-foreground">Обрабатывается...</span>
                  ) : (
                    <span className={`font-bold ${getScoreColor(audit.score)}`}>
                      {audit.score}/100
                    </span>
                  )}
                </td>
                <td className="py-4 px-4">
                  {new Date(audit.date).toLocaleString('ru-RU')}
                </td>
                <td className="py-4 px-4">
                  <Badge 
                    variant={
                      audit.status === 'completed' ? 'default' : 
                      audit.status === 'processing' ? 'secondary' : 'destructive'
                    }
                  >
                    {audit.status === 'completed' && 'Завершен'}
                    {audit.status === 'processing' && 'Обрабатывается'}
                    {audit.status === 'failed' && 'Ошибка'}
                  </Badge>
                </td>
                <td className="py-4 px-4">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default AdminAudits;
