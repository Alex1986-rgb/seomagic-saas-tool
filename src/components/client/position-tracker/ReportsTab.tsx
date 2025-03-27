
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, TrendingUp, Globe, ArrowRight, ShoppingCart } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ReportsTabProps {
  handleOrder: (type: 'audit' | 'position' | 'optimization') => void;
}

const ReportsTab: React.FC<ReportsTabProps> = ({ handleOrder }) => {
  const { toast } = useToast();
  
  return (
    <div className="space-y-6">
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
        <Button 
          size="lg" 
          className="gap-2"
          onClick={() => toast({
            title: "Переход на PRO тариф",
            description: "Открыта страница выбора PRO тарифа с расширенными возможностями",
          })}
        >
          <span>Перейти на PRO тариф</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ReportsTab;
