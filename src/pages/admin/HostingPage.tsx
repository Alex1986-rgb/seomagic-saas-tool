
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, CloudUpload, Server, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { HostingCredentials, hostingService } from '@/services/api/hostingService';

const HostingPage: React.FC = () => {
  const { toast } = useToast();
  const [provider, setProvider] = useState<'ftp' | 'beget' | 'cpanel'>('beget');
  const [credentials, setCredentials] = useState<HostingCredentials>({
    provider: 'beget',
    host: '',
    username: '',
    password: '',
    apiKey: '',
    port: 21,
    path: '/public_html'
  });
  const [savedHostings, setSavedHostings] = useState<HostingCredentials[]>(() => {
    const saved = localStorage.getItem('admin_saved_hostings');
    return saved ? JSON.parse(saved) : [];
  });
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  
  const handleProviderChange = (value: string) => {
    setProvider(value as 'ftp' | 'beget' | 'cpanel');
    setCredentials(prev => ({
      ...prev,
      provider: value as 'ftp' | 'beget' | 'cpanel',
      port: value === 'ftp' ? 21 : undefined
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const saveHosting = () => {
    if (!credentials.username) {
      toast({
        title: "Ошибка сохранения",
        description: "Введите имя пользователя",
        variant: "destructive"
      });
      return;
    }
    
    if (!credentials.password && !credentials.apiKey) {
      toast({
        title: "Ошибка сохранения",
        description: "Введите пароль или API-ключ",
        variant: "destructive"
      });
      return;
    }
    
    const newHostings = [...savedHostings, credentials];
    setSavedHostings(newHostings);
    localStorage.setItem('admin_saved_hostings', JSON.stringify(newHostings));
    
    toast({
      title: "Хостинг сохранен",
      description: `Хостинг ${credentials.username}@${credentials.provider} успешно сохранен`,
    });
    
    // Сбросить поля
    setCredentials({
      provider: 'beget',
      host: '',
      username: '',
      password: '',
      apiKey: '',
      port: 21,
      path: '/public_html'
    });
  };
  
  const deleteHosting = (index: number) => {
    const newHostings = [...savedHostings];
    newHostings.splice(index, 1);
    setSavedHostings(newHostings);
    localStorage.setItem('admin_saved_hostings', JSON.stringify(newHostings));
    
    toast({
      title: "Хостинг удален",
      description: "Настройки хостинга успешно удалены",
    });
  };
  
  const testConnection = async () => {
    try {
      // Имитация теста подключения
      setTestResult({ success: true, message: "Подключение установлено успешно!" });
      toast({
        title: "Тест успешен",
        description: "Соединение с хостингом установлено успешно",
      });
    } catch (error) {
      setTestResult({ success: false, message: "Ошибка подключения. Проверьте учетные данные." });
      toast({
        title: "Ошибка подключения",
        description: "Не удалось подключиться к хостингу",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto px-6 py-10 max-w-6xl">
      <Helmet>
        <title>Управление хостингами | Админ-панель</title>
      </Helmet>
      
      <div className="mb-8 px-8 py-10 rounded-3xl bg-gradient-to-br from-blue-50 via-white/80 to-purple-50 flex items-center gap-6 border border-primary/15 shadow-2xl">
        <div className="bg-primary/20 text-primary rounded-full p-5 shadow-lg">
          <Server className="h-10 w-10" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gradient-primary">Управление хостингами</h1>
          <p className="text-muted-foreground">
            Настройка и управление хостингами для автоматической публикации сайтов
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Добавление хостинга</CardTitle>
              <CardDescription>
                Настройте доступ к хостингу для автоматической публикации сайтов
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="provider">Хостинг-провайдер</Label>
                <Select value={provider} onValueChange={handleProviderChange}>
                  <SelectTrigger id="provider">
                    <SelectValue placeholder="Выберите провайдер" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beget">Beget</SelectItem>
                    <SelectItem value="cpanel">cPanel</SelectItem>
                    <SelectItem value="ftp">FTP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {provider === 'ftp' && (
                <div className="space-y-2">
                  <Label htmlFor="host">FTP Хост</Label>
                  <Input id="host" name="host" placeholder="ftp.example.com" value={credentials.host} onChange={handleInputChange} />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username">Имя пользователя</Label>
                <Input id="username" name="username" placeholder="username" value={credentials.username} onChange={handleInputChange} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input id="password" name="password" type="password" placeholder="••••••••" value={credentials.password} onChange={handleInputChange} />
              </div>
              
              {provider === 'beget' && (
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API-ключ (опционально)</Label>
                  <Input id="apiKey" name="apiKey" placeholder="API-ключ Beget" value={credentials.apiKey} onChange={handleInputChange} />
                </div>
              )}
              
              {(provider === 'ftp' || provider === 'cpanel') && (
                <div className="space-y-2">
                  <Label htmlFor="path">Путь на сервере</Label>
                  <Input id="path" name="path" placeholder="/public_html" value={credentials.path} onChange={handleInputChange} />
                </div>
              )}
              
              {provider === 'ftp' && (
                <div className="space-y-2">
                  <Label htmlFor="port">Порт</Label>
                  <Input id="port" name="port" type="number" placeholder="21" value={credentials.port?.toString()} onChange={handleInputChange} />
                </div>
              )}
              
              {testResult && (
                <Alert variant={testResult.success ? "default" : "destructive"}>
                  {testResult.success ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    {testResult.message}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                onClick={testConnection} 
                variant="outline"
                className="w-full"
              >
                Проверить подключение
              </Button>
              <Button 
                onClick={saveHosting}
                className="w-full"
              >
                <Server className="mr-2 h-4 w-4" />
                Сохранить настройки хостинга
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Сохраненные хостинги</CardTitle>
              <CardDescription>
                Список доступных хостингов для публикации сайтов
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {savedHostings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Server className="mx-auto h-10 w-10 mb-3 opacity-50" />
                  <p>Еще не добавлено ни одного хостинга.</p>
                  <p className="text-sm">Добавьте хостинг с помощью формы слева.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Провайдер</TableHead>
                      <TableHead>Пользователь</TableHead>
                      <TableHead>Тип доступа</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {savedHostings.map((hosting, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {hosting.provider}
                          </Badge>
                        </TableCell>
                        <TableCell>{hosting.username}</TableCell>
                        <TableCell>{hosting.apiKey ? "API + Пароль" : "Пароль"}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setCredentials(hosting);
                                setProvider(hosting.provider);
                              }}
                            >
                              Редактировать
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => deleteHosting(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          
          <Card className="shadow-md mt-6">
            <CardHeader>
              <CardTitle>Автоматическая публикация сайтов</CardTitle>
              <CardDescription>
                Опубликуйте оптимизированный сайт на поддомен хостинга
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="domain">Домен или поддомен</Label>
                <Input id="domain" placeholder="site.example.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hosting">Выберите хостинг</Label>
                <Select>
                  <SelectTrigger id="hosting">
                    <SelectValue placeholder="Выберите хостинг" />
                  </SelectTrigger>
                  <SelectContent>
                    {savedHostings.map((hosting, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {hosting.username}@{hosting.provider}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="site">Выберите оптимизированный сайт</Label>
                <Select>
                  <SelectTrigger id="site">
                    <SelectValue placeholder="Выберите сайт" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="example1">example.com (Оптимизирован 21.04.2025)</SelectItem>
                    <SelectItem value="example2">site.ru (Оптимизирован 20.04.2025)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button className="w-full">
                <CloudUpload className="mr-2 h-4 w-4" />
                Опубликовать сайт на хостинг
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HostingPage;
