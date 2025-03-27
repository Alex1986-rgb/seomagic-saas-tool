
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search, History, BarChart, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Link } from 'react-router-dom';
import { 
  PositionTrackerForm, 
  PositionTrackerResults 
} from '@/components/position-tracker';
import { 
  StatsOverview,
  PositionsDistributionChart,
  DailyActivityChart,
  SearchEngineDistribution,
  KeywordPositionTrend,
  RankingDistribution
} from '@/components/position-tracker/analytics';
import { getPositionHistory } from '@/services/position/positionHistory';
import { Card, CardContent } from "@/components/ui/card";

const ClientPositionTracker: React.FC = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [activeTab, setActiveTab] = useState('search');
  const [recentScans, setRecentScans] = useState([]);
  const [showAdditionalCharts, setShowAdditionalCharts] = useState(false);
  const { toast } = useToast();

  // Загрузка последних проверок при монтировании компонента
  React.useEffect(() => {
    loadRecentScans();
  }, []);

  const loadRecentScans = async () => {
    try {
      const history = await getPositionHistory();
      setRecentScans(history.slice(0, 3));
    } catch (error) {
      console.error('Ошибка загрузки истории:', error);
      toast({
        title: "Ошибка загрузки данных",
        description: "Не удалось загрузить историю проверок позиций",
        variant: "destructive",
      });
    }
  };

  const handleSearchComplete = (results) => {
    setSearchResults(results);
    setActiveTab('results');
    loadRecentScans(); // Обновляем список последних проверок
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Анализ позиций сайта</h2>
        <Link to="/position-tracker">
          <Button variant="outline" className="gap-2">
            <span>Полный функционал</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      
      {recentScans.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Последние проверки</h3>
          <StatsOverview history={recentScans} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <PositionsDistributionChart history={recentScans} />
            <DailyActivityChart history={recentScans} />
          </div>
          
          <div className="mt-6">
            <Button 
              variant="outline" 
              onClick={() => setShowAdditionalCharts(!showAdditionalCharts)}
              className="w-full flex items-center justify-center gap-2"
            >
              {showAdditionalCharts ? (
                <>
                  <span>Скрыть расширенную аналитику</span>
                  <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  <span>Показать расширенную аналитику</span>
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </Button>
            
            {showAdditionalCharts && (
              <div className="mt-6 animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
                <KeywordPositionTrend history={recentScans} />
                <RankingDistribution history={recentScans} />
                <div className="md:col-span-2">
                  <SearchEngineDistribution history={recentScans} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>Проверка позиций</span>
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Результаты</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span>История</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="neo-card p-6">
          <TabsContent value="search">
            <PositionTrackerForm onSearchComplete={handleSearchComplete} />
          </TabsContent>
          
          <TabsContent value="results">
            {searchResults ? (
              <PositionTrackerResults results={searchResults} />
            ) : (
              <div className="text-center py-12">
                <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-medium mb-2">Нет данных для отображения</h3>
                <p className="text-muted-foreground">
                  Запустите проверку позиций во вкладке "Проверка позиций", чтобы увидеть результаты
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="history">
            {recentScans.length > 0 ? (
              <div className="space-y-4">
                {recentScans.map((item, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-lg">{item.domain}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(item.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">
                            <span className="font-medium">{item.keywords.length}</span> ключевых слов
                          </p>
                          <p className="text-sm text-green-600">
                            <span className="font-medium">
                              {item.keywords.filter(k => k.position > 0 && k.position <= 10).length}
                            </span> в ТОП-10
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t">
                        <div className="grid grid-cols-4 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Поисковик</p>
                            <p className="font-medium">
                              {item.searchEngine === 'all' ? 'Все' : 
                                item.searchEngine === 'google' ? 'Google' : 
                                item.searchEngine === 'yandex' ? 'Яндекс' : 'Mail.ru'}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Регион</p>
                            <p className="font-medium">{item.region || 'Не указан'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Глубина</p>
                            <p className="font-medium">{item.depth} позиций</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Частота</p>
                            <p className="font-medium">
                              {item.scanFrequency === 'once' ? 'Разовая' : 
                               item.scanFrequency === 'daily' ? 'Ежедневно' : 
                               item.scanFrequency === 'weekly' ? 'Еженедельно' : 'Разовая'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <div className="text-center mt-4">
                  <Link to="/position-tracker">
                    <Button variant="outline" size="sm">
                      Просмотреть полную историю
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <History className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-medium mb-2">История пуста</h3>
                <p className="text-muted-foreground">
                  У вас пока нет проверок позиций сайта
                </p>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
      
      <div className="mt-6 p-6 border border-dashed rounded-lg">
        <div className="text-center">
          <h3 className="text-xl font-medium mb-3">Расширенная аналитика позиций</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Получите доступ к профессиональным отчетам, расширенной аналитике и мониторингу позиций 
            в режиме реального времени с премиум-подпиской.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="border rounded-lg p-4 text-center">
              <BarChart className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h4 className="font-medium mb-1">Анализ конкурентов</h4>
              <p className="text-sm text-muted-foreground">
                Сравнение позиций вашего сайта с конкурентами в реальном времени
              </p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <History className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h4 className="font-medium mb-1">Исторические данные</h4>
              <p className="text-sm text-muted-foreground">
                Долгосрочный анализ позиций с сохранением данных до 2 лет
              </p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <Search className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h4 className="font-medium mb-1">Мониторинг 24/7</h4>
              <p className="text-sm text-muted-foreground">
                Автоматические проверки и уведомления об изменении позиций
              </p>
            </div>
          </div>
          
          <Link to="/position-pricing">
            <Button variant="default" size="lg">
              Подключить премиум-функции
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClientPositionTracker;
