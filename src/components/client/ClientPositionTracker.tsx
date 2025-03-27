
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  FileText,
  Search,
  TrendingUp,
  ArrowRight,
  Globe,
  History,
  AlertCircle,
  ShoppingCart
} from 'lucide-react';
import {
  StatCard,
  StatsOverview,
  PositionsDistributionChart,
  DailyActivityChart,
  SearchEngineDistribution,
  TopKeywordsTable,
  KeywordPositionTrend,
  RankingDistribution
} from '@/components/position-tracker/analytics';
import { getPositionHistory } from '@/services/position/positionHistory';
import { PositionData } from '@/services/position/positionTracker';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const ClientPositionTracker: React.FC = () => {
  const [history, setHistory] = useState<PositionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [orderType, setOrderType] = useState<'audit' | 'position' | 'optimization'>('audit');
  const { toast } = useToast();

  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      try {
        const data = await getPositionHistory();
        setHistory(data);
      } catch (error) {
        console.error('Error loading position history:', error);
        toast({
          title: "Ошибка загрузки данных",
          description: "Не удалось загрузить историю проверок позиций",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [toast]);

  const handleOrder = (type: 'audit' | 'position' | 'optimization') => {
    setOrderType(type);
    setOrderDialogOpen(true);
  };

  const submitOrder = () => {
    toast({
      title: "Заказ размещен",
      description: `Ваш заказ на ${
        orderType === 'audit' ? 'аудит сайта' : 
        orderType === 'position' ? 'проверку позиций' : 
        'оптимизацию сайта'
      } успешно размещен`,
    });
    setOrderDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Позиции сайта</h1>
          <p className="text-muted-foreground">
            Отслеживание позиций сайта по ключевым словам и анализ конкурентов
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span>История проверок</span>
          </Button>
          <Button className="flex items-center gap-2" onClick={() => handleOrder('position')}>
            <Search className="h-4 w-4" />
            <span>Проверить позиции</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Обзор</span>
          </TabsTrigger>
          <TabsTrigger value="keywords" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>Ключевые слова</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>Тренды</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Отчёты</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <StatsOverview history={history} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Распределение позиций</h3>
              <PositionsDistributionChart history={history} />
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Распределение по поисковым системам</h3>
              <SearchEngineDistribution history={history} />
            </Card>
          </div>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Динамика проверок</h3>
            <DailyActivityChart history={history} />
          </Card>
        </TabsContent>

        {/* Keywords Tab */}
        <TabsContent value="keywords" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Отслеживаемые ключевые слова"
              value="34"
              description="За последние 30 дней"
              icon={<Search className="h-5 w-5" />}
              trend="+5"
              trendType="up"
            />
            <StatCard
              title="Средняя позиция"
              value="12.4"
              description="За последние 30 дней"
              icon={<BarChart className="h-5 w-5" />}
              trend="-2.3"
              trendType="up"
            />
            <StatCard
              title="Ключевых слов в ТОП-10"
              value="18"
              description="За последние 30 дней"
              icon={<TrendingUp className="h-5 w-5" />}
              trend="+3"
              trendType="up"
            />
          </div>
          
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Топ ключевых слов</h3>
              <Button variant="outline" size="sm">Экспорт</Button>
            </div>
            <TopKeywordsTable history={history} />
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Распределение по рангам</h3>
            <RankingDistribution history={history} />
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Изменение за 30 дней"
              value="+8.3"
              description="Улучшение средней позиции"
              icon={<TrendingUp className="h-5 w-5" />}
              trend="+12%"
              trendType="up"
            />
            <StatCard
              title="Топ растущие ключи"
              value="7"
              description="Ключевые слова с ростом"
              icon={<BarChart className="h-5 w-5" />}
              trend="+2"
              trendType="up"
            />
            <StatCard
              title="Снижающиеся ключи"
              value="3"
              description="Ключевые слова со снижением"
              icon={<BarChart className="h-5 w-5" />}
              trend="-1"
              trendType="down"
            />
          </div>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Тренд ключевого слова</h3>
            <KeywordPositionTrend history={history} />
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="p-6 border-primary/20">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium">SEO Аудит</h3>
                  <p className="text-sm text-muted-foreground">Комплексный анализ SEO-показателей вашего сайта</p>
                </div>
                <div className="bg-primary/10 text-primary p-2 rounded-full">
                  <AlertCircle className="h-6 w-6" />
                </div>
              </div>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                  <span>Детальный технический анализ</span>
                </li>
                <li className="flex items-center text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                  <span>Проверка внутренней оптимизации</span>
                </li>
                <li className="flex items-center text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                  <span>Рекомендации по улучшению</span>
                </li>
              </ul>
              <Button 
                className="w-full flex items-center justify-center gap-2" 
                onClick={() => handleOrder('audit')}
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Заказать аудит</span>
              </Button>
            </Card>
            
            <Card className="p-6 border-primary/20">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium">Оптимизация сайта</h3>
                  <p className="text-sm text-muted-foreground">Комплексное улучшение SEO-показателей</p>
                </div>
                <div className="bg-primary/10 text-primary p-2 rounded-full">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                  <span>Исправление технических ошибок</span>
                </li>
                <li className="flex items-center text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                  <span>Оптимизация контента</span>
                </li>
                <li className="flex items-center text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                  <span>Улучшение скорости загрузки</span>
                </li>
              </ul>
              <Button 
                className="w-full flex items-center justify-center gap-2"
                onClick={() => handleOrder('optimization')}
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Заказать оптимизацию</span>
              </Button>
            </Card>
          </div>
          
          <div className="neo-card p-8 text-center">
            <Globe className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-medium mb-2">Расширенные отчеты</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Получите доступ к подробным отчетам о позициях сайта, динамике по времени и сравнение с конкурентами
            </p>
            <Button size="lg" className="gap-2">
              <span>Перейти на PRO тариф</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {orderType === 'audit' ? 'Заказ аудита сайта' : 
               orderType === 'position' ? 'Заказ проверки позиций' : 
               'Заказ оптимизации сайта'}
            </DialogTitle>
            <DialogDescription>
              Заполните форму для оформления заказа на 
              {orderType === 'audit' ? ' SEO аудит вашего сайта' : 
               orderType === 'position' ? ' проверку позиций сайта в поисковых системах' : 
               ' комплексную оптимизацию вашего сайта'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <div className="font-medium">Выбранный сайт:</div>
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>example.com</span>
              </div>
            </div>
            
            <div className="grid gap-2">
              <div className="font-medium">Тариф:</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="border rounded-md p-3 flex flex-col items-center cursor-pointer bg-primary/5">
                  <div className="font-medium">Базовый</div>
                  <div className="text-sm text-muted-foreground">{orderType === 'audit' ? '5,900₽' : orderType === 'position' ? '2,900₽' : '19,900₽'}</div>
                </div>
                <div className="border rounded-md p-3 flex flex-col items-center cursor-pointer hover:bg-muted/50">
                  <div className="font-medium">Расширенный</div>
                  <div className="text-sm text-muted-foreground">{orderType === 'audit' ? '11,900₽' : orderType === 'position' ? '5,900₽' : '39,900₽'}</div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOrderDialogOpen(false)}>Отмена</Button>
            <Button onClick={submitOrder}>Оформить заказ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientPositionTracker;
