import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Link, RefreshCw, Globe, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { proxyManager } from '@/services/proxy/proxyManager';
import type { ProxySources } from '@/services/proxy/types';
import { pythonProxySources, createProxySources, loadCustomProxySources, saveCustomProxySources } from '@/services/proxy/proxySourceManager';

const ProxySourcesManager: React.FC = () => {
  const [sources, setSources] = useState<ProxySources>({});
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [sourcesText, setSourcesText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const defaultSources = proxyManager.defaultProxySources;
    const customSources = loadCustomProxySources();
    
    setSources({...defaultSources, ...customSources});
  }, []);
  
  const handleAddSource = () => {
    if (!newSourceUrl.trim()) {
      toast({
        title: "Ошибка",
        description: "URL источника не может быть пустым",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (!newSourceUrl.startsWith('http://') && !newSourceUrl.startsWith('https://')) {
        toast({
          title: "Ошибка",
          description: "URL должен начинаться с http:// или https://",
          variant: "destructive",
        });
        return;
      }
      
      const newSources = createProxySources([newSourceUrl]);
      const updatedSources = {...sources, ...newSources};
      
      setSources(updatedSources);
      saveCustomProxySources(updatedSources);
      
      toast({
        title: "Источник добавлен",
        description: `Источник ${newSourceUrl} успешно добавлен`,
      });
      
      setNewSourceUrl('');
    } catch (error) {
      console.error('Ошибка при добавлении источника:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить источник прокси",
        variant: "destructive",
      });
    }
  };
  
  const handleAddSourcesFromText = () => {
    if (!sourcesText.trim()) {
      toast({
        title: "Ошибка",
        description: "Список источников не может быть пустым",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsAdding(true);
      
      const urls = sourcesText
        .split('\n')
        .map(url => url.trim())
        .filter(url => url && (url.startsWith('http://') || url.startsWith('https://')));
      
      if (urls.length === 0) {
        toast({
          title: "Ошибка",
          description: "Не найдено валидных URL источников",
          variant: "destructive",
        });
        return;
      }
      
      const newSources = createProxySources(urls);
      const updatedSources = {...sources, ...newSources};
      
      setSources(updatedSources);
      saveCustomProxySources(updatedSources);
      
      toast({
        title: "Источники добавлены",
        description: `Добавлено ${urls.length} новых источников прокси`,
      });
      
      setSourcesText('');
    } catch (error) {
      console.error('Ошибка при добавлении источников:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить источники прокси",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };
  
  const handleImportFromPython = () => {
    try {
      setIsAdding(true);
      
      const pythonSources = createProxySources(pythonProxySources);
      const updatedSources = {...sources, ...pythonSources};
      
      setSources(updatedSources);
      saveCustomProxySources(updatedSources);
      
      toast({
        title: "Импорт завершен",
        description: `Импортировано ${pythonProxySources.length} источников из Python-скрипта`,
      });
    } catch (error) {
      console.error('Ошибка при импорте из Python:', error);
      toast({
        title: "Ошибка импорта",
        description: "Не удалось импортировать источники из Python-скрипта",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteSource = (sourceName: string) => {
    try {
      const updatedSources = {...sources};
      delete updatedSources[sourceName];
      
      setSources(updatedSources);
      saveCustomProxySources(updatedSources);
      
      toast({
        title: "Источник удален",
        description: `Источник ${sourceName} успешно удален`,
      });
    } catch (error) {
      console.error('Ошибка при удалении источника:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить источник прокси",
        variant: "destructive",
      });
    }
  };
  
  const handleToggleSource = (sourceName: string, enabled: boolean) => {
    try {
      const updatedSources = {...sources};
      updatedSources[sourceName].enabled = enabled;
      
      setSources(updatedSources);
      saveCustomProxySources(updatedSources);
    } catch (error) {
      console.error('Ошибка при изменении статуса источника:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось изменить статус источника",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Управление источниками прокси
        </CardTitle>
        <CardDescription>
          Настройка источников для сбора и обновления прокси-серверов
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="list">
          <TabsList className="mb-4">
            <TabsTrigger value="list">Список источников</TabsTrigger>
            <TabsTrigger value="add">Добавление источников</TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Текущие источники: {Object.keys(sources).length}</h3>
                <Button variant="outline" size="sm" onClick={handleImportFromPython} disabled={isAdding}>
                  <Database className="mr-2 h-4 w-4" />
                  Импорт из Python
                </Button>
              </div>
              
              {Object.keys(sources).length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Название</TableHead>
                        <TableHead>URL</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(sources).map(([name, source]) => {
                        const typedSource = source as {
                          url: string;
                          enabled: boolean;
                          parseFunction: (data: string) => any[];
                        };
                        
                        return (
                          <TableRow key={name}>
                            <TableCell className="font-medium">{name}</TableCell>
                            <TableCell className="max-w-[300px] truncate">
                              <a href={typedSource.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                                <Link className="h-3 w-3" />
                                {typedSource.url}
                              </a>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={typedSource.enabled}
                                  onCheckedChange={(checked) => handleToggleSource(name, checked)}
                                />
                                <span>{typedSource.enabled ? 'Включен' : 'Выключен'}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteSource(name)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Globe className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Нет источников прокси. Добавьте источники на вкладке "Добавление источников"
                    или импортируйте из Python-скрипта.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="add">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Добавить один источник</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com/proxy-list"
                    value={newSourceUrl}
                    onChange={(e) => setNewSourceUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAddSource}>
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">Массовое добавление источников</h3>
                <Textarea
                  placeholder="https://example.com/proxy-list&#10;https://another-site.com/proxies&#10;https://free-proxies.net/"
                  value={sourcesText}
                  onChange={(e) => setSourcesText(e.target.value)}
                  rows={5}
                />
                <Button onClick={handleAddSourcesFromText} disabled={isAdding}>
                  {isAdding ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Добавление...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить список
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProxySourcesManager;
