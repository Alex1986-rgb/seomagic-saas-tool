
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Zap, BarChart, CheckCircle, ArrowRight, Users, Award, Shield } from 'lucide-react';

const CoreFeaturesSection: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const features = [
    {
      icon: Search,
      title: "Умный SEO аудит",
      description: "Комплексное сканирование сайта с использованием ИИ для выявления всех SEO-проблем и скрытых возможностей оптимизации.",
      stats: "200+ параметров",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Zap,
      title: "Автоматическая оптимизация",
      description: "Мгновенное применение улучшений с помощью продвинутых алгоритмов машинного обучения для максимального эффекта.",
      stats: "30 сек анализ",
      color: "from-green-500 to-green-600"
    },
    {
      icon: BarChart,
      title: "Мониторинг позиций",
      description: "Отслеживание позиций в реальном времени по тысячам ключевых слов с детальной аналитикой и прогнозами.",
      stats: "24/7 мониторинг",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary),0.1)_0%,transparent_70%)]" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          className="text-center mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-6 border border-primary/20 backdrop-blur-sm">
              <CheckCircle className="w-4 h-4 mr-2" />
              Революционные возможности
            </div>
          </motion.div>

          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold mb-6 font-playfair"
          >
            <span className="block">
              Платформа будущего для{" "}
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              SEO профессионалов
            </span>
          </motion.h2>

          <motion.p 
            variants={itemVariants}
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Объединяем мощь искусственного интеллекта с глубокой экспертизой в SEO 
            для создания инструментов нового поколения
          </motion.p>
        </motion.div>
        
        {/* Features grid */}
        <motion.div 
          className="grid lg:grid-cols-3 gap-8 mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="relative p-8 rounded-3xl bg-background/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 h-full">
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`} />
                
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>

                {/* Content */}
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <span className={`text-xs px-3 py-1 rounded-full bg-gradient-to-r ${feature.color} text-white font-medium`}>
                      {feature.stats}
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all cursor-pointer">
                    <span className="text-sm">Узнать больше</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { icon: Users, number: "50K+", label: "Активных пользователей" },
            { icon: Award, number: "98%", label: "Точность анализа" },
            { icon: Shield, number: "99.9%", label: "Время работы" },
            { icon: BarChart, number: "+43%", label: "Средний рост трафика" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center group"
            >
              <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CoreFeaturesSection;
