
import React, { useState } from 'react';
import { FileText, Download, Search, Calendar, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Мок-данные отчетов пользователя
const mockReports = [
  {
    id: '1',
    title: 'SEO аудит - example.com',
    url: 'https://example.com',
    type: 'audit',
    date: '2023-06-08T14:30:00Z',
    size: '1.2 MB',
    downloaded: true,
  },
  {
    id: '2',
    title: 'Оптимизация - example.com',
    url: 'https://example.com',
    type: 'optimization',
    date: '2023-06-08T16:30:00Z',
    size: '3.5 MB',
    downloaded: true,
  },
  {
    id: '3',
    title: 'SEO аудит - mywebsite.ru',
    url: 'https://mywebsite.ru',
    type: 'audit',
    date: '2023-06-07T09:15:00Z',
    size: '0.9 MB',
    downloaded: false,
  },
  {
    id: '4',
    title: 'Сравнение До/После - shop.example.com',
    url: 'https://shop.example.com',
    type: 'comparison',
    date: '2023-06-06T12:20:00Z',
    size: '2.1 MB',
    downloaded: true,
  },
  {
    id: '5',
    title: 'SEO аудит - shop.example.com',
    url: 'https://shop.example.com',
    type: 'audit',
    date: '2023-06-06T10:20:00Z',
    size: '1.4 MB',
    downloaded: false,
  },
];

const ClientReports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Фильтрация отчетов
  const filteredReports = mockReports.filter(report => 
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getReportIcon = (type) => {
    switch(type) {
      case 'audit': return <FileText className="h-10 w-10 text-blue-500" />;
      case 'optimization': return <CheckCircle className="h-10 w-10 text-green-500" />;
      case 'comparison': return <Eye className="h-10 w-10 text-purple-500" />;
      default: return <FileText className="h-10 w-10 text-muted-foreground" />;
    }
  };

  const getReportBadge = (type) => {
    switch(type) {
      case 'audit': return <Badge>Аудит</Badge>;
      case 'optimization': return <Badge variant="outline" className="text-green-500 border-green-500">Оптимизация</Badge>;
      case 'comparison': return <Badge variant="secondary">Сравнение</Badge>;
      default: return <Badge variant="outline">Другое</Badge>;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Отчеты и документы</h2>
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          <span>Фильтр по дате</span>
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск отчетов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReports.length === 0 ? (
          <div className="col-span-2 text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Нет отчетов</h3>
            <p className="text-muted-foreground">
              У вас пока нет сохраненных отчетов.
            </p>
          </div>
        ) : (
          filteredReports.map(report => (
            <div key={report.id} className="neo-card p-4 flex items-center">
              <div className="mr-4">
                {getReportIcon(report.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate">{report.title}</h3>
                  {getReportBadge(report.type)}
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <span className="truncate">{report.url}</span>
                  <span className="mx-2">•</span>
                  <span>{report.size}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {new Date(report.date).toLocaleString('ru-RU')}
                </div>
              </div>
              
              <Button 
                variant={report.downloaded ? "ghost" : "default"} 
                size="sm"
                className="ml-2"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientReports;
