
import React from 'react';
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
  History
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

const ClientPositionTracker: React.FC = () => {
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
          <Button className="flex items-center gap-2">
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
          <StatsOverview />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Распределение позиций</h3>
              <PositionsDistributionChart />
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Распределение по поисковым системам</h3>
              <SearchEngineDistribution />
            </Card>
          </div>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Динамика проверок</h3>
            <DailyActivityChart />
          </Card>
        </TabsContent>

        {/* Keywords Tab */}
        <TabsContent value="keywords" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Отслеживаемые ключевые слова"
              value="34"
              trend="+3"
              trendType="up"
              description="За последние 30 дней"
              icon={<Search className="h-5 w-5" />}
            />
            <StatCard
              title="Средняя позиция"
              value="12.4"
              trend="-2.1"
              trendType="up"
              description="За последние 30 дней"
              icon={<BarChart className="h-5 w-5" />}
            />
            <StatCard
              title="Ключевых слов в ТОП-10"
              value="18"
              trend="+5"
              trendType="up"
              description="За последние 30 дней"
              icon={<TrendingUp className="h-5 w-5" />}
            />
          </div>
          
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Топ ключевых слов</h3>
              <Button variant="outline" size="sm">Экспорт</Button>
            </div>
            <TopKeywordsTable />
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Распределение по рангам</h3>
            <RankingDistribution />
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Изменение за 30 дней"
              value="+8.3"
              trend="23%"
              trendType="up"
              description="Улучшение средней позиции"
              icon={<TrendingUp className="h-5 w-5" />}
            />
            <StatCard
              title="Топ растущие ключи"
              value="7"
              trend="+4"
              trendType="up"
              description="Ключевые слова с ростом"
              icon={<BarChart className="h-5 w-5" />}
            />
            <StatCard
              title="Снижающиеся ключи"
              value="3"
              trend="-1"
              trendType="down"
              description="Ключевые слова со снижением"
              icon={<BarChart className="h-5 w-5" />}
            />
          </div>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Тренд ключевого слова</h3>
            <KeywordPositionTrend />
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Недавние отчеты</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <h4 className="font-medium">Еженедельный отчет</h4>
                    <p className="text-sm text-muted-foreground">12.05.2023</p>
                  </div>
                  <Button variant="outline" size="sm">Скачать</Button>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <h4 className="font-medium">Сравнение с конкурентами</h4>
                    <p className="text-sm text-muted-foreground">05.05.2023</p>
                  </div>
                  <Button variant="outline" size="sm">Скачать</Button>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <h4 className="font-medium">Ежемесячный отчет</h4>
                    <p className="text-sm text-muted-foreground">01.05.2023</p>
                  </div>
                  <Button variant="outline" size="sm">Скачать</Button>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Запланированные отчеты</h3>
              <div className="space-y-4">
                <div className="p-3 border rounded-md opacity-60">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Еженедельный отчет</h4>
                    <div className="text-sm text-muted-foreground">PRO</div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Автоматические отчеты каждую неделю</p>
                  <Button variant="outline" size="sm" disabled>Настроить</Button>
                </div>
                <div className="p-3 border rounded-md opacity-60">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Сравнение с конкурентами</h4>
                    <div className="text-sm text-muted-foreground">PRO</div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Регулярный анализ конкурентов</p>
                  <Button variant="outline" size="sm" disabled>Настроить</Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientPositionTracker;
