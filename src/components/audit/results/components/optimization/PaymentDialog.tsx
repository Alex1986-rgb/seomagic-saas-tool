
import React, { useState } from 'react';
import { Check, CreditCard, Loader2, ArrowRight, FileText, ShieldCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PaymentDialogProps {
  url: string;
  optimizationCost: number;
  onPayment: () => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ 
  url, 
  optimizationCost, 
  onPayment, 
  isDialogOpen, 
  setIsDialogOpen 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const { toast } = useToast();
  
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Call the payment callback
      onPayment();
      
      toast({
        title: "Оплата прошла успешно",
        description: "Ваш платеж был обработан, оптимизация будет запущена.",
        variant: "default",
      });
      
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Ошибка платежа",
        description: "Не удалось обработать платеж. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const optimizationDetails = [
    { 
      id: 'meta',
      title: 'Оптимизация мета-тегов', 
      description: 'Улучшение всех мета-тегов для лучшей индексации в поисковых системах',
      items: [
        'Создание оптимальных title для каждой страницы',
        'Оптимизация meta description с ключевыми словами',
        'Настройка Open Graph тегов для социальных сетей',
        'Оптимизация H1-H6 заголовков',
        'Создание и оптимизация meta keywords'
      ]
    },
    { 
      id: 'content',
      title: 'Улучшение контента', 
      description: 'Оптимизация содержимого страниц для повышения релевантности',
      items: [
        'Улучшение текстовой структуры с учетом SEO',
        'Добавление и оптимизация alt-атрибутов для изображений',
        'Оптимизация внутренних ссылок',
        'Создание структурированных данных (Schema.org)',
        'Улучшение читаемости текста для пользователей'
      ]
    },
    { 
      id: 'images',
      title: 'Оптимизация изображений', 
      description: 'Улучшение работы с медиафайлами для ускорения загрузки',
      items: [
        'Сжатие изображений без потери качества',
        'Оптимизация формата изображений (WebP, AVIF)',
        'Создание оптимальных размеров для разных устройств',
        'Настройка ленивой загрузки (lazy loading)',
        'Улучшение именования файлов для SEO'
      ]
    },
    { 
      id: 'technical',
      title: 'Технические улучшения', 
      description: 'Оптимизация технических аспектов для лучшей производительности',
      items: [
        'Минификация CSS и JavaScript файлов',
        'Оптимизация кода для ускорения загрузки',
        'Исправление ошибок в HTML коде',
        'Улучшение структуры страниц',
        'Оптимизация robots.txt и sitemap.xml'
      ]
    },
    { 
      id: 'duplicates',
      title: 'Работа с дублями', 
      description: 'Выявление и удаление дублирующегося контента',
      items: [
        'Поиск и устранение дублей страниц',
        'Настройка канонических URL (canonical)',
        'Создание редиректов для устаревших страниц',
        'Исправление проблем с дублирующимися мета-тегами',
        'Консолидация содержимого для улучшения релевантности'
      ]
    }
  ];

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">Оплатить и оптимизировать</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl w-[95%]">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-semibold">Оплата оптимизации</DialogTitle>
          <DialogDescription className="pt-2 text-muted-foreground">
            Оптимизация сайта <span className="font-medium text-foreground">{url}</span> будет выполнена после оплаты
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="details">Что входит</TabsTrigger>
            <TabsTrigger value="payment">Оплата</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <div className="rounded-lg bg-primary/10 p-4">
              <h4 className="font-medium mb-3 text-center">Что будет сделано:</h4>
              <Accordion type="single" collapsible className="w-full">
                {optimizationDetails.map((detail) => (
                  <AccordionItem key={detail.id} value={detail.id}>
                    <AccordionTrigger className="text-sm hover:no-underline">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span>{detail.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-xs text-muted-foreground mb-2">{detail.description}</p>
                      <ul className="space-y-1 text-xs pl-6 list-disc">
                        {detail.items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            
            <div className="rounded-lg border p-4 border-primary/20">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Результаты оптимизации:
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 shrink-0" />
                  <span>Повышение видимости сайта в поисковых системах</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 shrink-0" />
                  <span>Улучшение позиций по целевым запросам</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 shrink-0" />
                  <span>Увеличение органического трафика</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 shrink-0" />
                  <span>Ускорение загрузки страниц</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 shrink-0" />
                  <span>Улучшение пользовательского опыта</span>
                </li>
              </ul>
            </div>
            
            <div className="flex justify-between items-center p-3 border border-primary/30 rounded-lg bg-primary/5">
              <span className="font-medium">Итого к оплате:</span>
              <span className="text-xl font-bold">{formatNumber(optimizationCost)} ₽</span>
            </div>
            
            <Button 
              onClick={() => setActiveTab('payment')} 
              className="w-full gap-2"
            >
              Перейти к оплате
              <ArrowRight className="h-4 w-4" />
            </Button>
          </TabsContent>
          
          <TabsContent value="payment" className="space-y-4">
            <div className="rounded-lg bg-primary/10 p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2 justify-center">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Безопасная оплата
              </h4>
              <div className="text-sm space-y-2">
                <p>Вы можете оплатить услугу любым удобным способом:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  <div className="border rounded p-2 text-center text-xs">Банковская карта</div>
                  <div className="border rounded p-2 text-center text-xs">СБП</div>
                  <div className="border rounded p-2 text-center text-xs">ЮMoney</div>
                  <div className="border rounded p-2 text-center text-xs">WebMoney</div>
                  <div className="border rounded p-2 text-center text-xs">PayPal</div>
                  <div className="border rounded p-2 text-center text-xs">Криптовалюта</div>
                </div>
              </div>
            </div>
            
            <div className="border p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm">Услуга:</span>
                <span className="text-sm font-medium">Оптимизация сайта</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm">Сайт:</span>
                <span className="text-sm font-medium">{url}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm">Метод оплаты:</span>
                <span className="text-sm font-medium">Банковская карта</span>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Итого к оплате:</span>
                  <span className="text-xl font-bold">{formatNumber(optimizationCost)} ₽</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button 
                onClick={handlePayment} 
                className="gap-2 w-full" 
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Обработка платежа...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Оплатить {formatNumber(optimizationCost)} ₽
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('details')}
                className="w-full"
                disabled={isProcessing}
              >
                Вернуться к деталям
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex flex-col text-xs text-muted-foreground border-t pt-4 mt-2">
          <div className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            <span>Ваши платежные данные защищены шифрованием</span>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
