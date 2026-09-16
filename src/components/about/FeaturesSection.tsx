
import React from 'react';
import { motion } from 'framer-motion';
import { Award, Search, FileText, TrendingUp, Sparkles, Gauge, History } from 'lucide-react';
import FeatureCard from './FeatureCard';

/*
 * Здесь обещались «проверка более 100 параметров», «моментальный анализ»,
 * «помощь экспертов по SEO», «международный сервис» и «высокий уровень
 * обслуживания». Параметров столько аудит не проверяет, анализ сайта занимает
 * время, штата экспертов и отдельной поддержки для разных стран нет. Теперь
 * перечислено то, что сервис действительно делает.
 */
const FeaturesSection = () => {
  const features = [
    {
      title: "Аудит страниц", 
      description: "Ответ сервера, индексация, метатеги, заголовки, контент и ссылки — по каждой проверенной странице",
      icon: <Search className="w-6 h-6" />
    },
    {
      title: "Рекомендации ИИ", 
      description: "По результатам аудита языковая модель предлагает title, description, структуру заголовков и правки текста",
      icon: <Sparkles className="w-6 h-6" />
    },
    {
      title: "Позиции в поиске", 
      description: "Проверка мест сайта в выдаче Яндекса и Google по вашему списку запросов",
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      title: "Скорость ответа", 
      description: "Время ответа сервера, время загрузки и сжатие страниц",
      icon: <Gauge className="w-6 h-6" />
    },
    {
      title: "Отчёты", 
      description: "Результаты аудита выгружаются в PDF и JSON",
      icon: <FileText className="w-6 h-6" />
    },
    {
      title: "История проверок", 
      description: "Аудиты и оптимизации, запущенные после входа, сохраняются в личном кабинете",
      icon: <History className="w-6 h-6" />
    }
  ];

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-32"
    >
      <div className="text-center mb-16">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-4">
          <Award className="w-4 h-4 mr-2" />
          Преимущества
        </div>
        <h2 className="font-playfair text-4xl font-bold mb-6">Что умеет сервис</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Аудит, ИИ-оптимизация и проверка позиций в одном кабинете
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard 
            key={index}
            title={feature.title} 
            description={feature.description}
            icon={feature.icon}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default FeaturesSection;
