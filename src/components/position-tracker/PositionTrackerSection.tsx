
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChartBar } from 'lucide-react';
import { Link } from 'react-router-dom';

const PositionTrackerSection: React.FC = () => {
  // Sample position data for demonstration
  const positionData = [
    { keyword: 'купить смартфон', engine: 'Google', position: 3, change: 2 },
    { keyword: 'интернет магазин техники', engine: 'Google', position: 5, change: -7 },
    { keyword: 'ноутбуки распродажа', engine: 'Google', position: 8, change: 1 },
    { keyword: 'смартфоны со скидкой', engine: 'Google', position: 12, change: 2 },
    { keyword: 'купить планшет недорого', engine: 'Google', position: 15, change: 5 },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-background/60">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center mb-12"
        >
          <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
            Новая функция
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Анализ позиций сайта</h2>
          <p className="text-lg text-muted-foreground">
            Отслеживайте позиции вашего сайта в поисковых системах и получайте ценные инсайты для улучшения SEO-стратегии
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold mb-6">Мощные возможности анализа</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <ChartBar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">Проверка в нескольких поисковых системах</h4>
                  <p className="text-muted-foreground">Отслеживайте позиции в Яндекс, Google и Mail.ru одновременно</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <ChartBar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">Подробная аналитика</h4>
                  <p className="text-muted-foreground">Анализируйте динамику позиций по ключевым запросам с помощью наглядных графиков</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <ChartBar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">История изменений</h4>
                  <p className="text-muted-foreground">Отслеживайте прогресс и изменения позиций вашего сайта с течением времени</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <ChartBar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">Глубокий анализ конкурентов</h4>
                  <p className="text-muted-foreground">Сравнивайте позиции своего сайта с конкурентами по ключевым запросам</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild size="lg">
                <Link to="/position-tracking">Проверить позиции</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/position-pricing">Тарифы и цены</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-card rounded-xl shadow-lg border border-border/50"
          >
            <div className="p-5 border-b border-border">
              <h3 className="text-lg font-medium">Позиции сайта</h3>
              <div className="text-sm text-muted-foreground">example.com</div>
            </div>
            <div className="bg-muted/30 p-4 text-center">
              <div className="inline-flex items-center text-lg font-medium text-green-500">
                +12%
                <svg className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5L19 12L12 19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="p-0">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Ключевое слово</th>
                    <th className="text-center p-4 text-sm font-medium text-muted-foreground">Поисковик</th>
                    <th className="text-center p-4 text-sm font-medium text-muted-foreground">Позиция</th>
                    <th className="text-center p-4 text-sm font-medium text-muted-foreground">Изм.</th>
                  </tr>
                </thead>
                <tbody>
                  {positionData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                      <td className="text-left p-4">{item.keyword}</td>
                      <td className="text-center p-4">{item.engine}</td>
                      <td className="text-center p-4 font-medium">{item.position}</td>
                      <td className={`text-center p-4 ${item.change > 0 ? 'text-green-500' : item.change < 0 ? 'text-red-500' : ''}`}>
                        {item.change > 0 ? `+${item.change}` : item.change}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 border-t border-border">
                <Button asChild variant="secondary" className="w-full">
                  <Link to="/position-tracking" className="flex items-center justify-center gap-2">
                    Проверить свой сайт
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PositionTrackerSection;
