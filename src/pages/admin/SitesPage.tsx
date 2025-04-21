
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowUpRight, 
  CloudUpload, 
  Download, 
  Globe, 
  MoreHorizontal, 
  Server,
  PlusCircle,
  Clock,
  CheckCircle
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface OptimizedSite {
  id: string;
  domain: string;
  optimizedDate: string;
  status: 'completed' | 'in_progress';
  score: number;
  deployedUrl?: string;
}

const SitesPage: React.FC = () => {
  const { toast } = useToast();
  const [newSite, setNewSite] = useState('');
  const [sites, setSites] = useState<OptimizedSite[]>(() => {
    const saved = localStorage.getItem('admin_optimized_sites');
    return saved ? JSON.parse(saved) : [
      {
        id: 'site_1',
        domain: 'example.com',
        optimizedDate: '2025-04-21',
        status: 'completed',
        score: 92,
        deployedUrl: 'https://opt-example.beget.tech'
      },
      {
        id: 'site_2',
        domain: 'mysite.ru',
        optimizedDate: '2025-04-20',
        status: 'completed',
        score: 87
      },
      {
        id: 'site_3',
        domain: 'newproject.com',
        optimizedDate: '2025-04-21',
        status: 'in_progress',
        score: 0
      }
    ];
  });
  
  const addNewSite = () => {
    if (!newSite) {
      toast({
        title: "Ошибка добавления",
        description: "Введите URL сайта",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Валидация URL
      new URL(newSite.startsWith('http') ? newSite : `https://${newSite}`);
      
      const domain = newSite.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      
      const newSiteObject: OptimizedSite = {
        id: `site_${Date.now()}`,
        domain,
        optimizedDate: new Date().toISOString().split('T')[0],
        status: 'in_progress',
        score: 0
      };
      
      const updatedSites = [...sites, newSiteObject];
      setSites(updatedSites);
      localStorage.setItem('admin_optimized_sites', JSON.stringify(updatedSites));
      
      setNewSite('');
      
      toast({
        title: "Сайт добавлен",
        description: `Сайт ${domain} добавлен в очередь на оптимизацию`,
      });
      
      // Имитация завершения оптимизации через 5 секунд
      setTimeout(() => {
        const siteIndex = updatedSites.findIndex(s => s.id === newSiteObject.id);
        if (siteIndex !== -1) {
          updatedSites[siteIndex].status = 'completed';
          updatedSites[siteIndex].score = Math.floor(Math.random() * 20) + 80;
          setSites([...updatedSites]);
          localStorage.setItem('admin_optimized_sites', JSON.stringify(updatedSites));
          
          toast({
            title: "Оптимизация завершена",
            description: `Сайт ${domain} успешно оптимизирован`,
          });
        }
      }, 5000);
      
    } catch (e) {
      toast({
        title: "Некорректный URL",
        description: "Введите корректный URL сайта",
        variant: "destructive"
      });
    }
  };
  
  const deployToBeget = (site: OptimizedSite) => {
    if (site.status !== 'completed') {
      toast({
        title: "Невозможно опубликовать",
        description: "Сайт еще не оптимизирован",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Публикация на Beget",
      description: "Начинаем публикацию сайта на Beget хостинг...",
    });
    
    // Имитация процесса публикации
    setTimeout(() => {
      const siteIndex = sites.findIndex(s => s.id === site.id);
      if (siteIndex !== -1) {
        const updatedSites = [...sites];
        updatedSites[siteIndex].deployedUrl = `https://opt-${site.domain.replace(/\./g, '-')}.beget.tech`;
        setSites(updatedSites);
        localStorage.setItem('admin_optimized_sites', JSON.stringify(updatedSites));
        
        toast({
          title: "Публикация завершена",
          description: `Сайт успешно опубликован на ${updatedSites[siteIndex].deployedUrl}`,
        });
      }
    }, 3000);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSite(e.target.value);
  };

  return (
    <div className="container mx-auto px-6 py-10 max-w-6xl">
      <Helmet>
        <title>Управление сайтами | Админ-панель</title>
      </Helmet>
      
      <div className="mb-8 px-8 py-10 rounded-3xl bg-gradient-to-br from-blue-50 via-white/80 to-purple-50 flex items-center gap-6 border border-primary/15 shadow-2xl">
        <div className="bg-primary/20 text-primary rounded-full p-5 shadow-lg">
          <Globe className="h-10 w-10" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gradient-primary">Управление сайтами</h1>
          <p className="text-muted-foreground">
            Оптимизированные сайты и публикация на хостинги
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Добавление нового сайта</CardTitle>
            <CardDescription>
              Добавьте новый сайт для оптимизации и публикации
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="newSite" className="sr-only">URL сайта</Label>
                <Input 
                  id="newSite" 
                  placeholder="Введите URL сайта (example.com)" 
                  value={newSite} 
                  onChange={handleInputChange}
                />
              </div>
              <Button onClick={addNewSite}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Добавить сайт
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Оптимизированные сайты</CardTitle>
            <CardDescription>
              Список оптимизированных сайтов и их статусы
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Домен</TableHead>
                  <TableHead>Дата оптимизации</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Оценка</TableHead>
                  <TableHead>Публикация</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sites.map((site) => (
                  <TableRow key={site.id}>
                    <TableCell className="font-medium">{site.domain}</TableCell>
                    <TableCell>{site.optimizedDate}</TableCell>
                    <TableCell>
                      {site.status === 'completed' ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Завершено
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="animate-pulse">
                          <Clock className="mr-1 h-3 w-3" />
                          В процессе
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {site.status === 'completed' ? (
                        <Badge 
                          className={site.score >= 90 ? 'bg-green-100 text-green-800' : 
                                    site.score >= 80 ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'}
                        >
                          {site.score}/100
                        </Badge>
                      ) : (
                        '–'
                      )}
                    </TableCell>
                    <TableCell>
                      {site.deployedUrl ? (
                        <a 
                          href={site.deployedUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-primary hover:underline"
                        >
                          {site.deployedUrl.replace(/^https?:\/\//, '')}
                          <ArrowUpRight className="ml-1 h-3 w-3" />
                        </a>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={site.status !== 'completed'}
                          onClick={() => deployToBeget(site)}
                        >
                          <Server className="mr-1 h-3 w-3" />
                          Опубликовать
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            className="flex items-center"
                            disabled={site.status !== 'completed'}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Скачать архив
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="flex items-center"
                            disabled={site.status !== 'completed'}
                          >
                            <CloudUpload className="mr-2 h-4 w-4" />
                            Опубликовать на хостинг
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SitesPage;
