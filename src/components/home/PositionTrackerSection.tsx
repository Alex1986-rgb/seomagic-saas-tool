
import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, BarChart, Activity } from 'lucide-react';

const PositionTrackerSection: React.FC = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Отслеживание позиций</h2>
        <div className="neo-card p-8 rounded-lg">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Мониторинг позиций в реальном времени</h3>
              <p className="text-muted-foreground mb-6">
                Отслеживайте позиции вашего сайта по ключевым запросам в поисковых системах. 
                Получайте уведомления об изменениях и аналитику для улучшения SEO-стратегии.
              </p>
              <ul className="space-y-3">
                {[
                  "Ежедневное обновление позиций",
                  "Мониторинг конкурентов",
                  "Анализ динамики изменений",
                  "Детальные отчеты и рекомендации"
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      ✓
                    </div>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
            <motion.div 
              className="bg-muted/20 p-6 rounded-lg border border-border"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-medium">Динамика позиций</h4>
                <div className="flex gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-[200px] w-full flex items-end justify-between gap-1">
                  {Array.from({ length: 14 }).map((_, i) => {
                    const height = 30 + Math.random() * 70;
                    return (
                      <div 
                        key={i} 
                        className="bg-primary/70 rounded-t w-full" 
                        style={{ height: `${height}%` }}
                      ></div>
                    );
                  })}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "В топ-10", value: "+15%", icon: <LineChart className="h-4 w-4" /> },
                    { label: "Видимость", value: "62.4%", icon: <BarChart className="h-4 w-4" /> },
                    { label: "Рост трафика", value: "+23%", icon: <Activity className="h-4 w-4" /> }
                  ].map((stat, index) => (
                    <div key={index} className="bg-background/50 p-3 rounded-md">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        {stat.icon}
                        <span className="text-xs">{stat.label}</span>
                      </div>
                      <div className="font-semibold">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PositionTrackerSection;
