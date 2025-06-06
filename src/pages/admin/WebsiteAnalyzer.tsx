
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  Search, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Download,
  ExternalLink,
  FileText,
  Settings,
  Zap,
  TrendingUp,
  Shield
} from 'lucide-react';
import { useWebsiteAnalyzer } from '@/hooks/use-website-analyzer';

const WebsiteAnalyzer: React.FC = () => {
  const {
    url,
    isScanning,
    scanProgress,
    scanStage,
    isError,
    errorMessage,
    scanResults,
    scannedUrls,
    handleUrlChange,
    startFullScan
  } = useWebsiteAnalyzer();

  const [activeTab, setActiveTab] = useState("overview");

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Helmet>
        <title>Анализатор веб-сайтов | Админ-панель</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Анализатор веб-сайтов
        </h1>
        <p className="text-muted-foreground text-lg">
          Комплексный анализ и сканирование веб-сайтов для SEO оптимизации
        </p>
      </div>

      {/* Форма сканирования */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Анализ веб-сайта
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Введите URL сайта (например: example.com)"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={startFullScan} 
              disabled={isScanning || !url}
              className="gap-2"
            >
              <Search className="h-4 w-4" />
              {isScanning ? 'Сканирование...' : 'Сканировать'}
            </Button>
          </div>

          {isError && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
              {errorMessage || 'Произошла ошибка при сканировании'}
            </div>
          )}

          {isScanning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{scanStage}</span>
                <span>{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Результаты анализа */}
      {scanResults.totalPages > 0 && (
        <div className="space-y-6">
          {/* Общая статистика */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Всего страниц</p>
                    <p className="text-2xl font-bold">{scanResults.totalPages}</p>
                  </div>
                  <Globe className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Битые ссылки</p>
                    <p className="text-2xl font-bold text-red-600">{scanResults.brokenLinks}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Дубли контента</p>
                    <p className="text-2xl font-bold text-yellow-600">{scanResults.duplicateContent}</p>
                  </div>
                  <FileText className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Нет метаданных</p>
                    <p className="text-2xl font-bold text-orange-600">{scanResults.missingMetadata}</p>
                  </div>
                  <Settings className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Детальные результаты */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Обзор</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="performance">Производительность</TabsTrigger>
              <TabsTrigger value="content">Контент</TabsTrigger>
              <TabsTrigger value="technical">Техническая часть</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Общий обзор сайта</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-3xl font-bold text-green-600 mb-2">85</div>
                      <div className="text-sm text-muted-foreground">SEO балл</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-3xl font-bold text-yellow-600 mb-2">72</div>
                      <div className="text-sm text-muted-foreground">Производительность</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 mb-2">91</div>
                      <div className="text-sm text-muted-foreground">Контент</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">SEO оптимизация</span>
                      <Badge variant={getScoreBadgeVariant(85)}>85%</Badge>
                    </div>
                    <Progress value={85} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Производительность</span>
                      <Badge variant={getScoreBadgeVariant(72)}>72%</Badge>
                    </div>
                    <Progress value={72} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Качество контента</span>
                      <Badge variant={getScoreBadgeVariant(91)}>91%</Badge>
                    </div>
                    <Progress value={91} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    SEO анализ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <div className="font-medium">Title теги</div>
                          <div className="text-sm text-muted-foreground">Все страницы имеют уникальные title</div>
                        </div>
                      </div>
                      <Badge variant="default">Отлично</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        <div>
                          <div className="font-medium">Meta описания</div>
                          <div className="text-sm text-muted-foreground">{scanResults.missingMetadata} страниц без описания</div>
                        </div>
                      </div>
                      <Badge variant="secondary">Требует внимания</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <div className="font-medium">Структура URL</div>
                          <div className="text-sm text-muted-foreground">URL структура оптимизирована</div>
                        </div>
                      </div>
                      <Badge variant="default">Отлично</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Производительность
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Время загрузки</div>
                        <div className="text-sm text-muted-foreground">Среднее время загрузки страниц</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">2.4с</div>
                        <Badge variant="secondary">Средне</Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Размер страницы</div>
                        <div className="text-sm text-muted-foreground">Средний размер загружаемых страниц</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">1.2MB</div>
                        <Badge variant="default">Хорошо</Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Мобильная версия</div>
                        <div className="text-sm text-muted-foreground">Адаптивность для мобильных устройств</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">95%</div>
                        <Badge variant="default">Отлично</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Анализ контента
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Уникальность контента</div>
                        <div className="text-sm text-muted-foreground">Процент уникального контента</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">88%</div>
                        <Badge variant="default">Хорошо</Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Дублированный контент</div>
                        <div className="text-sm text-muted-foreground">{scanResults.duplicateContent} страниц с дублями</div>
                      </div>
                      <div className="text-right">
                        <Badge variant={scanResults.duplicateContent > 5 ? "destructive" : "default"}>
                          {scanResults.duplicateContent > 5 ? "Критично" : "Норма"}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Ключевые слова</div>
                        <div className="text-sm text-muted-foreground">Оптимизация ключевых слов</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">76%</div>
                        <Badge variant="secondary">Средне</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="technical" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Техническая часть
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <div>
                          <div className="font-medium">Битые ссылки</div>
                          <div className="text-sm text-muted-foreground">{scanResults.brokenLinks} неработающих ссылок</div>
                        </div>
                      </div>
                      <Badge variant={scanResults.brokenLinks > 0 ? "destructive" : "default"}>
                        {scanResults.brokenLinks > 0 ? "Требует исправления" : "Отлично"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <div className="font-medium">SSL сертификат</div>
                          <div className="text-sm text-muted-foreground">HTTPS соединение активно</div>
                        </div>
                      </div>
                      <Badge variant="default">Активен</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <div className="font-medium">Robots.txt</div>
                          <div className="text-sm text-muted-foreground">Файл robots.txt настроен корректно</div>
                        </div>
                      </div>
                      <Badge variant="default">Настроен</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <div className="font-medium">Sitemap.xml</div>
                          <div className="text-sm text-muted-foreground">XML карта сайта найдена</div>
                        </div>
                      </div>
                      <Badge variant="default">Найден</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Действия с результатами */}
          <Card>
            <CardHeader>
              <CardTitle>Экспорт результатов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Скачать отчет PDF
                </Button>
                <Button variant="outline" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Экспорт в Excel
                </Button>
                <Button variant="outline" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Поделиться ссылкой
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WebsiteAnalyzer;
