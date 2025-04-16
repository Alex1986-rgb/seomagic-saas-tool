
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  FileText, 
  Wrench, 
  Globe, 
  BarChart, 
  Zap, 
  LineChart, 
  Link2, 
  Shield, 
  AlertTriangle,
  Database,
  Sparkles,
  Gauge,
  Code,
  Users,
  Mail,
  Smartphone,
  Share2,
  Settings,
  Award
} from 'lucide-react';
import FeatureItem from './FeatureItem';

const features = [
  {
    icon: <Search size={24} />,
    text: "Глубокий SEO Анализ",
    link: "/features/seo-analysis"
  },
  {
    icon: <FileText size={24} />,
    text: "Детальный PDF Отчет",
    link: "/features/pdf-reports"
  },
  {
    icon: <Wrench size={24} />,
    text: "Автоматическое исправление",
    link: "/features/auto-fix"
  },
  {
    icon: <Globe size={24} />,
    text: "Оптимизированная копия",
    link: "/features/optimized-copy"
  },
  {
    icon: <BarChart size={24} />,
    text: "Аналитика и статистика",
    link: "/features/analytics"
  },
  {
    icon: <Zap size={24} />,
    text: "Быстрая оптимизация",
    link: "/features/quick-optimization"
  },
  {
    icon: <LineChart size={24} />,
    text: "Мониторинг позиций",
    link: "/features/position-tracking"
  },
  {
    icon: <Link2 size={24} />,
    text: "Анализ ссылок",
    link: "/features/link-analysis"
  },
  {
    icon: <Shield size={24} />,
    text: "Безопасность сайта",
    link: "/features/site-security"
  },
  {
    icon: <AlertTriangle size={24} />,
    text: "Выявление ошибок",
    link: "/features/error-detection"
  },
  {
    icon: <Database size={24} />,
    text: "Структура данных",
    link: "/features/data-structure"
  },
  {
    icon: <Sparkles size={24} />,
    text: "ИИ рекомендации",
    link: "/features/ai-recommendations"
  },
  {
    icon: <Gauge size={24} />,
    text: "Скорость загрузки",
    link: "/features/load-speed"
  },
  {
    icon: <Code size={24} />,
    text: "Технический SEO",
    link: "/features/technical-seo"
  },
  {
    icon: <Users size={24} />,
    text: "Анализ конкурентов",
    link: "/features/competitor-analysis"
  },
  {
    icon: <Mail size={24} />,
    text: "Email отчеты",
    link: "/features/email-reports"
  },
  {
    icon: <Smartphone size={24} />,
    text: "Мобильная оптимизация",
    link: "/features/mobile-optimization"
  },
  {
    icon: <Share2 size={24} />,
    text: "Интеграции",
    link: "/features/integrations"
  },
  {
    icon: <Settings size={24} />,
    text: "Настройка параметров",
    link: "/features/settings"
  },
  {
    icon: <Award size={24} />,
    text: "Сертификация сайта",
    link: "/features/site-certification"
  }
];

const FeatureGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full">
      {features.map((feature, index) => (
        <FeatureItem 
          key={index}
          icon={feature.icon}
          text={feature.text}
          link={feature.link}
        />
      ))}
    </div>
  );
};

export default FeatureGrid;
