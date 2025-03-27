
import React, { useState } from 'react';
import { Search, Calendar, Link, ExternalLink, Download, Filter, FileText } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';

// Мок-данные аудитов пользователя
const mockUserAudits = [
  {
    id: '1',
    url: 'https://example.com',
    score: 78,
    date: '2023-06-08T14:30:00Z',
    status: 'completed',
    issues: { critical: 3, important: 8, opportunities: 12 },
    optimized: true,
  },
  {
    id: '2',
    url: 'https://mywebsite.ru',
    score: 45,
    date: '2023-06-07T09:15:00Z',
    status: 'completed',
    issues: { critical: 12, important: 15, opportunities: 7 },
    optimized: false,
  },
  {
    id: '3',
    url: 'https://shop.example.com',
    score: 92,
    date: '2023-06-06T10:20:00Z',
    status: 'completed',
    issues: { critical: 0, important: 4, opportunities: 8 },
    optimized: true,
  },
  {
    id: '4',
    url: 'https://blog.mywebsite.ru',
    score: null,
    date: '2023-06-08T16:45:00Z',
    status: 'processing',
    issues: null,
    optimized: false,
  },
];

interface ClientAuditsProps {
  onStartNewAudit?: () => void;
}

const ClientAudits: React.FC<ClientAuditsProps> = ({ onStartNewAudit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  // Фильтрация аудитов
  const filteredAudits = mockUserAudits.filter(audit => 
    audit.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getScoreColor = (score) => {
    if (score === null) return 'text-muted-foreground';
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const handleNewAudit = () => {
    if (onStartNewAudit) {
      onStartNewAudit();
    } else {
      navigate('/audit');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Ваши SEO аудиты</h2>
        <Button className="gap-2" onClick={handleNewAudit}>
          <FileText className="h-4 w-4" />
          <span>Новый аудит</span>
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по URL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span>Фильтр по дате</span>
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            <span>Фильтры</span>
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredAudits.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Нет аудитов</h3>
            <p className="text-muted-foreground mb-6">
              У вас пока нет SEO аудитов. Начните с анализа вашего сайта.
            </p>
            <Button onClick={handleNewAudit}>
              Запустить новый аудит
            </Button>
          </div>
        ) : (
          filteredAudits.map(audit => (
            <div key={audit.id} className="neo-card p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Link className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={audit.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium hover:underline"
                    >
                      {audit.url}
                    </a>
                    {audit.optimized && (
                      <Badge variant="outline" className="ml-2 text-green-500 border-green-500">
                        Оптимизирован
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(audit.date).toLocaleString('ru-RU')}
                  </div>
                </div>
                
                <div className="flex items-center mt-4 md:mt-0">
                  {audit.status === 'processing' ? (
                    <div className="flex items-center text-primary">
                      <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-primary animate-spin mr-2"></div>
                      <span>Обрабатывается...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">SEO оценка</div>
                        <div className={`text-xl font-semibold ${getScoreColor(audit.score)}`}>
                          {audit.score}/100
                        </div>
                      </div>
                      
                      {audit.issues && (
                        <div className="flex gap-2">
                          <div className="text-center px-2 py-1 rounded bg-red-500/10">
                            <div className="text-xs text-muted-foreground">Критические</div>
                            <div className="font-semibold">{audit.issues.critical}</div>
                          </div>
                          <div className="text-center px-2 py-1 rounded bg-amber-500/10">
                            <div className="text-xs text-muted-foreground">Важные</div>
                            <div className="font-semibold">{audit.issues.important}</div>
                          </div>
                          <div className="text-center px-2 py-1 rounded bg-green-500/10">
                            <div className="text-xs text-muted-foreground">Возможности</div>
                            <div className="font-semibold">{audit.issues.opportunities}</div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/audit?url=${encodeURIComponent(audit.url)}`}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Детали
                          </a>
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          PDF
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientAudits;
