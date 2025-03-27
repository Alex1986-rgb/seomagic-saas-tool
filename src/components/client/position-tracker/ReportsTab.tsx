
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileCheck, FileCog, FileText, BarChart, Search, Maximize2, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface ReportsTabProps {
  handleOrder: (type: 'audit' | 'position' | 'optimization') => void;
}

const ReportsTab: React.FC<ReportsTabProps> = ({ handleOrder }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Отчеты и анализ</h2>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>{date ? format(date, "dd MMMM yyyy", { locale: ru }) : "Выберите дату"}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            <span>Обновить</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="reports">
        <TabsList className="mb-6">
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Отчеты</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Аналитика</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <Maximize2 className="h-4 w-4" />
            <span>Сравнение</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="reports">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileCheck className="h-5 w-5 text-primary" />
                      Отчет по позициям
                    </CardTitle>
                    <CardDescription>Позиции сайта в поисковых системах</CardDescription>
                  </div>
                  <Badge>Доступен</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Полный отчет о текущих позициях вашего сайта по всем ключевым словам в поисковых системах
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <span>Последнее обновление:</span>
                    <span>26.03.2025</span>
                  </div>
                  <div className="pt-2">
                    <Button
                      variant="default"
                      className="w-full flex items-center gap-2"
                      onClick={() => handleOrder('position')}
                    >
                      <Download className="h-4 w-4" />
                      <span>Скачать отчет</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart className="h-5 w-5 text-primary" />
                      Сравнительный анализ
                    </CardTitle>
                    <CardDescription>Сравнение с конкурентами</CardDescription>
                  </div>
                  <Badge>Доступен</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Сравнение позиций вашего сайта с конкурентами по выбранным ключевым словам
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <span>Последнее обновление:</span>
                    <span>25.03.2025</span>
                  </div>
                  <div className="pt-2">
                    <Button 
                      variant="default" 
                      className="w-full flex items-center gap-2"
                      onClick={() => handleOrder('position')}
                    >
                      <Search className="h-4 w-4" />
                      <span>Запросить анализ</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileCog className="h-5 w-5 text-primary" />
                      Рекомендации по SEO
                    </CardTitle>
                    <CardDescription>Оптимизация сайта</CardDescription>
                  </div>
                  <Badge variant="outline">Требуется заказ</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Подробные рекомендации по оптимизации сайта для улучшения позиций в поисковых системах
                  </p>
                  <div className="flex justify-between items-center text-sm">
                    <span>Статус:</span>
                    <span className="text-amber-500">Требуется заказ</span>
                  </div>
                  <div className="pt-2">
                    <Button 
                      variant="default" 
                      className="w-full flex items-center gap-2"
                      onClick={() => handleOrder('optimization')}
                    >
                      <FileCog className="h-4 w-4" />
                      <span>Заказать рекомендации</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analysis">
          <Card className="p-6">
            <div className="text-center py-8">
              <BarChart className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">Аналитика по запросу</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Детальный анализ позиций сайта с прогнозами и рекомендациями по продвижению
              </p>
              <Button 
                className="flex items-center gap-2 mx-auto"
                onClick={() => handleOrder('position')}
              >
                <Search className="h-4 w-4" />
                <span>Запустить анализ</span>
              </Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="comparison">
          <Card className="p-6">
            <div className="text-center py-8">
              <Maximize2 className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">Сравнение с конкурентами</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Сравните позиции вашего сайта с конкурентами по выбранным ключевым словам
              </p>
              <Button 
                className="flex items-center gap-2 mx-auto"
                onClick={() => handleOrder('position')}
              >
                <Maximize2 className="h-4 w-4" />
                <span>Начать сравнение</span>
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsTab;
