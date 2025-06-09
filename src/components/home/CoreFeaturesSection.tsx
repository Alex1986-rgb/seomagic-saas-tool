
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Zap, BarChart, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const CoreFeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Search,
      title: 'SEO Аудит',
      description: 'Комплексное сканирование сайта для выявления всех SEO-проблем и возможностей для улучшения.',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      link: '/features/полное-сканирование-сайта',
      stats: '200+ проверок'
    },
    {
      icon: Zap,
      title: 'ИИ оптимизация',
      description: 'Автоматическое применение оптимизаций с использованием продвинутых алгоритмов искусственного интеллекта.',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      link: '/features/автоматическое-исправление',
      stats: 'До 90% автоматизации'
    },
    {
      icon: BarChart,
      title: 'Отслеживание позиций',
      description: 'Мониторинг позиций вашего сайта в поисковых системах по важным ключевым словам.',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      link: '/features/отслеживание-позиций',
      stats: 'Ежедневный мониторинг'
    }
  ];

  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background -z-10" />
      
      {/* Декоративные элементы */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/5 rounded-full blur-xl" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/5 rounded-full blur-xl" />
      
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-medium mb-6 border border-primary/20">
            <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
            Комплексное SEO решение
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-playfair">
            <span className="relative inline-block">
              Основные возможности
              <motion.div 
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Набор инструментов для полного анализа и оптимизации вашего сайта
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div 
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <Link to={feature.link} className="block h-full">
                  <div className="relative p-8 bg-card rounded-2xl border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group-hover:border-primary/30 h-full">
                    {/* Фоновый градиент при наведении */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    
                    {/* Декоративный элемент */}
                    <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full opacity-20" />
                    
                    <div className="relative z-10">
                      {/* Иконка с анимацией */}
                      <div className={`mb-6 p-4 ${feature.bgColor} rounded-2xl inline-block group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className={`h-8 w-8 ${feature.iconColor}`} />
                      </div>
                      
                      {/* Контент */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                            {feature.title}
                          </h3>
                          <div className="text-xs text-muted-foreground font-medium mb-3 px-2 py-1 bg-muted/50 rounded-full inline-block">
                            {feature.stats}
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                        
                        {/* Кнопка действия */}
                        <div className="flex items-center text-primary font-medium pt-2 group-hover:translate-x-2 transition-transform duration-300">
                          <span className="text-sm">Подробнее</span>
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Анимированная линия снизу */}
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
        
        {/* Дополнительная информация */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="inline-flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span>Бесплатный базовый анализ</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span>Мгновенные результаты</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              <span>Без регистрации</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CoreFeaturesSection;
