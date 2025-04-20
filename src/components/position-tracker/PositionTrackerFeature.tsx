
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart, LineChart, PieChart, Search,
  ArrowUp, Globe, Target, Stars
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const PositionTrackerFeature: React.FC = () => {
  const navigate = useNavigate();

  const handlePositionCheck = () => {
    navigate('/position-tracking');
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Анализ позиций сайта
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Отслеживайте позиции вашего сайта в поисковых системах и получайте ценные инсайты для улучшения SEO-стратегии
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 md:order-1"
          >
            <h3 className="text-2xl font-bold mb-6">Мощные возможности анализа</h3>
            
            <div className="space-y-6">
              <Feature 
                icon={<Search className="h-5 w-5 text-primary" />}
                title="Проверка в нескольких поисковых системах"
                description="Отслеживайте позиции в Яндекс, Google и Mail.ru одновременно"
              />
              
              <Feature 
                icon={<BarChart className="h-5 w-5 text-primary" />}
                title="Подробная аналитика"
                description="Анализируйте динамику позиций по ключевым запросам с помощью наглядных графиков"
              />
              
              <Feature 
                icon={<LineChart className="h-5 w-5 text-primary" />}
                title="История изменений"
                description="Отслеживайте прогресс и изменения позиций вашего сайта с течением времени"
              />
              
              <Feature 
                icon={<Target className="h-5 w-5 text-primary" />}
                title="Глубокий анализ конкурентов"
                description="Сравнивайте позиции своего сайта с конкурентами по ключевым запросам"
              />
            </div>
            
            <div className="mt-8">
              <Button 
                onClick={handlePositionCheck}
                className="mr-4"
              >
                <Globe className="mr-2 h-4 w-4" />
                Проверить позиции
              </Button>
              <Link to="/position-pricing">
                <Button variant="outline">
                  Тарифы и цены
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            className="order-1 md:order-2 neo-card p-6 pt-8 relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground py-1 px-3 rounded-full text-sm font-medium">
              Новая функция
            </div>
            
            <div className="bg-background/50 p-6 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-lg font-semibold">Позиции сайта</h4>
                  <p className="text-sm text-muted-foreground">example.com</p>
                </div>
                <div className="flex items-center text-green-500">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>+12%</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { keyword: "купить смартфон", position: 3, change: 2 },
                  { keyword: "интернет магазин техники", position: 5, change: 7 },
                  { keyword: "ноутбуки распродажа", position: 8, change: 1 },
                  { keyword: "смартфоны со скидкой", position: 12, change: -2 },
                  { keyword: "купить планшет недорого", position: 15, change: 5 },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <div className="font-medium">{item.keyword}</div>
                      <div className="text-sm text-muted-foreground">Google</div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-lg font-bold mr-3">{item.position}</div>
                      <div className={`flex items-center ${item.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {item.change > 0 ? (
                          <ArrowUp className="h-4 w-4 mr-1" />
                        ) : (
                          <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <polyline points="19 12 12 19 5 12"></polyline>
                          </svg>
                        )}
                        <span>{Math.abs(item.change)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Link to="/position-tracking">
                  <Button variant="outline" className="w-full">Проверить свой сайт</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Feature: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="flex">
    <div className="mt-1 mr-4 flex-shrink-0 rounded-full bg-primary/10 p-2">
      {icon}
    </div>
    <div>
      <h4 className="font-semibold mb-1">{title}</h4>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default PositionTrackerFeature;
