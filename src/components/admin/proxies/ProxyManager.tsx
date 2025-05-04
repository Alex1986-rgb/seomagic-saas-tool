import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { TabLayout, TabItem } from "@/components/ui/tab-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, Shield, TrashIcon, Download, FileText, Rss, Wifi, FileDown } from 'lucide-react';
import ProxySourcesManager from './ProxySourcesManager';
import { useProxyManager } from '@/hooks/use-proxy-manager';
import ProxyList from './ProxyList';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import PingService from './PingService';
import { generateProxyReportPdf } from '@/utils/pdf/proxyReport';
import { useToast } from "@/hooks/use-toast";

const ProxyManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sources');
  const [testUrl, setTestUrl] = useState('https://api.ipify.org/');
  const [exportFormat, setExportFormat] = useState('text');
  const [importText, setImportText] = useState('');
  const { toast } = useToast();
  
  const { 
    proxies, 
    activeProxies, 
    collectProxies, 
    testProxies, 
    importProxies, 
    proxyManager,
    isLoading, 
    progress, 
    statusMessage,
    clearBeforeCollect,
    setClearBeforeCollect
  } = useProxyManager({ initialTestUrl: 'https://api.ipify.org/' });

  const handleClearProxies = () => {
    if (window.confirm('Вы уверены, что хотите удалить все прокси?')) {
      proxyManager.clearAllProxies();
    }
  };

  const handleImport = () => {
    if (importText.trim()) {
      importProxies(importText);
      setImportText('');
    }
  };

  const handleExport = () => {
    // Подготовка прокси для экспорта
    const allProxies = proxyManager.getAllProxies();
    if (allProxies.length === 0) {
      alert('Нет прокси для экспорта');
      return;
    }

    let exportData = '';
    if (exportFormat === 'text') {
      exportData = allProxies.map(p => `${p.ip}:${p.port}`).join('\n');
    } else if (exportFormat === 'json') {
      exportData = JSON.stringify(allProxies, null, 2);
    }

    // Создание и скачивание файла
    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proxies.${exportFormat === 'json' ? 'json' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Новая функция для экспорта PDF-отчета
  const handleExportPDF = async () => {
    const allProxies = proxyManager.getAllProxies();
    if (allProxies.length === 0) {
      toast({
        title: "Нет данных для отчета",
        description: "Сначала соберите прокси для генерации отчета",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Создание PDF отчета",
      description: "Пожалуйста, подождите...",
    });

    try {
      // Форматируем данные для отчета
      const proxyReportData = {
        proxies: allProxies.map(proxy => ({
          ip: proxy.ip,
          port: proxy.port,
          type: proxy.protocol || 'HTTP',
          country: proxy.country || undefined,
          speed: proxy.speed || undefined,
          status: proxy.status === 'active' ? 'active' as const : 'inactive' as const,
          lastChecked: proxy.lastChecked ? new Date(proxy.lastChecked).toLocaleString() : undefined
        })),
        stats: {
          total: allProxies.length,
          active: activeProxies.length,
          inactive: allProxies.length - activeProxies.length,
          averageSpeed: activeProxies.length > 0 
            ? activeProxies.reduce((sum, p) => sum + (p.speed || 0), 0) / activeProxies.length 
            : undefined
        },
        date: new Date().toISOString()
      };

      // Генерация PDF
      const pdfBlob = await generateProxyReportPdf(proxyReportData);

      // Сохранение файла
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `proxy_report_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Готово!",
        description: "PDF отчет успешно создан и скачан",
      });
    } catch (error) {
      console.error('Ошибка при создании PDF отчета:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать PDF отчет",
        variant: "destructive",
      });
    }
  };

  const tabs: TabItem[] = [
    {
      id: 'sources',
      label: 'Источники прокси',
      content: (
        <div className="grid gap-4">
          <ProxySourcesManager />
          
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">
              <p>Текущее количество активных прокси: <strong className="text-green-600">{activeProxies.length}</strong></p>
              <p>Всего прокси в базе: <strong>{proxies.length}</strong></p>
              
              {isLoading && progress > 0 && (
                <div className="mt-2">
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-primary rounded-full transition-all" 
                      style={{ width: `${progress}%` }} 
                    />
                  </div>
                  <p className="text-xs mt-1">{statusMessage}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )
    },
    {
      id: 'proxies',
      label: `Список прокси (${proxies.length})`,
      content: <ProxyList proxies={proxies} />
    },
    {
      id: 'ping',
      label: 'Пинг страниц и RSS',
      icon: <Rss className="h-4 w-4" />,
      content: <PingService />
    },
    {
      id: 'actions',
      label: 'Управление',
      content: (
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Управление прокси</h3>
          
          <div className="space-y-6">
            {/* Сбор и тестирование прокси */}
            <div className="space-y-4">
              <h4 className="font-medium">Сбор и проверка прокси</h4>
              
              <div className="flex flex-col space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="clear-before-collect">Очищать список перед сбором</Label>
                  <Switch 
                    id="clear-before-collect" 
                    checked={clearBeforeCollect}
                    onCheckedChange={setClearBeforeCollect}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Если включено, старые прокси будут удалены перед сбором новых
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => collectProxies(clearBeforeCollect)}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  {clearBeforeCollect ? 'Очистить и собрать прокси' : 'Собрать новые прокси'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => testProxies(proxyManager.getAllProxies(), testUrl)}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Проверить прокси
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClearProxies}
                  disabled={isLoading}
                  className="flex-1 text-red-500 hover:text-red-600"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Очистить все прокси
                </Button>
              </div>
              
              <div>
                <Label>URL для тестирования прокси</Label>
                <Input 
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                  placeholder="https://api.ipify.org/"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  URL для проверки работоспособности прокси
                </p>
              </div>
              
              {isLoading && progress > 0 && (
                <div className="space-y-2 my-4">
                  <Progress value={progress} className="w-full h-2" />
                  <p className="text-sm text-center">{statusMessage}</p>
                </div>
              )}
              
              {activeProxies.length === 0 && !isLoading && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>
                    Нет активных прокси. Рекомендуется собрать и проверить прокси для корректной работы сервиса.
                  </AlertDescription>
                </Alert>
              )}
              
              {activeProxies.length > 0 && activeProxies.length < 100 && !isLoading && (
                <Alert className="mt-2 border-yellow-200 bg-yellow-50 text-yellow-800">
                  <AlertDescription>
                    Рекомендуется собрать больше прокси для лучшей производительности. Текущее количество ({activeProxies.length}) может быть недостаточным.
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-4">Импорт и экспорт прокси</h4>
              
              <div className="space-y-4">
                {/* Импорт прокси */}
                <div>
                  <Label>Импорт прокси</Label>
                  <div className="flex gap-2 mt-1">
                    <textarea 
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={importText}
                      onChange={(e) => setImportText(e.target.value)}
                      placeholder="ip:port (каждый прокси с новой строки)"
                      rows={4}
                    />
                  </div>
                  <Button
                    className="mt-2"
                    onClick={handleImport}
                    disabled={!importText.trim()}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Импортировать прокси
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    Формат: ip:port, каждый прокси с новой строки
                  </p>
                </div>
                
                {/* Экспорт прокси */}
                <div>
                  <Label>Экспорт прокси</Label>
                  <div className="flex gap-2 mt-1">
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={exportFormat}
                      onChange={(e) => setExportFormat(e.target.value)}
                    >
                      <option value="text">Текстовый формат (ip:port)</option>
                      <option value="json">JSON формат</option>
                    </select>
                    <Button
                      onClick={handleExport}
                      disabled={proxies.length === 0}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Экспортировать
                    </Button>
                  </div>
                </div>
                
                {/* PDF отчет */}
                <div className="mt-4">
                  <Button 
                    variant="default"
                    onClick={handleExportPDF}
                    disabled={proxies.length === 0}
                    className="w-full"
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Скачать PDF отчет
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    Создать детальный PDF отчет о прокси с графиками и статистикой
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )
    },
    {
      id: 'stats',
      label: 'Статистика',
      content: (
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Статистика прокси</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportPDF} 
              className="flex items-center gap-2"
            >
              <FileDown className="h-4 w-4" />
              PDF отчет
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm border-b pb-2">
              <span>Всего прокси:</span>
              <span className="font-medium">{proxies.length}</span>
            </div>
            <div className="flex justify-between text-sm border-b pb-2">
              <span>Активных прокси:</span>
              <span className="font-medium text-green-600">{activeProxies.length}</span>
            </div>
            <div className="flex justify-between text-sm border-b pb-2">
              <span>Неактивных прокси:</span>
              <span className="font-medium text-red-600">{proxies.length - activeProxies.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Процент активности:</span>
              <span className="font-medium">
                {proxies.length > 0 ? Math.round((activeProxies.length / proxies.length) * 100) : 0}%
              </span>
            </div>
          </div>
        </Card>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <TabLayout 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default ProxyManager;
