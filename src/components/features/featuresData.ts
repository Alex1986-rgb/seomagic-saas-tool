
import { 
  Search, BarChart2, Globe, Zap, 
  PieChart, LineChart, Settings, AlarmClock, 
  Check, Lock, ArrowUpRight, Award,
  Wifi, Shield, AlertTriangle, Database,
  Code, FileSearch, Layers, Share2
} from 'lucide-react';
import { FeatureData } from './types';

export const featuresData: FeatureData[] = [
  {
    icon: Search,
    title: "Глубокий SEO-аудит",
    description: "Автоматический анализ более 100 факторов ранжирования и выявление всех технических ошибок вашего сайта.",
    link: "/audit",
    category: "Аудит"
  },
  {
    icon: BarChart2,
    title: "Мониторинг позиций",
    description: "Отслеживание позиций вашего сайта по ключевым запросам в поисковых системах в режиме реального времени.",
    link: "/position-tracker",
    category: "Мониторинг"
  },
  {
    icon: Globe,
    title: "Автоматическая оптимизация",
    description: "Интеллектуальные алгоритмы автоматически исправляют обнаруженные проблемы и улучшают SEO-показатели сайта.",
    link: "/features/optimization",
    category: "Оптимизация"
  },
  {
    icon: Zap,
    title: "Ускорение загрузки",
    description: "Анализ и оптимизация скорости загрузки страниц для улучшения пользовательского опыта и ранжирования.",
    link: "/features/speed-optimization",
    category: "Оптимизация"
  },
  {
    icon: PieChart,
    title: "Анализ конкурентов",
    description: "Сравнение вашего сайта с конкурентами и выявление их сильных сторон для улучшения вашей стратегии.",
    link: "/features/competitor-analysis",
    category: "Аналитика"
  },
  {
    icon: LineChart,
    title: "Аналитика роста",
    description: "Наглядная визуализация роста трафика и улучшения позиций с течением времени.",
    link: "/features/growth-analytics",
    category: "Аналитика"
  },
  {
    icon: Settings,
    title: "Настраиваемые отчеты",
    description: "Создание персонализированных отчетов для клиентов и руководства с фокусом на нужных метриках.",
    link: "/features/custom-reports",
    category: "Отчеты"
  },
  {
    icon: AlarmClock,
    title: "Автоматические проверки",
    description: "Регулярные автоматические проверки сайта на появление новых ошибок и проблем с оповещениями.",
    link: "/features/automated-checks",
    category: "Мониторинг"
  },
  {
    icon: Check,
    title: "Валидация разметки",
    description: "Проверка корректности HTML, JSON-LD и микроразметки для правильного отображения в поиске.",
    link: "/features/markup-validation",
    category: "Аудит"
  },
  {
    icon: Lock,
    title: "Безопасность сайта",
    description: "Проверка на наличие уязвимостей, вредоносного кода и проблем с SSL-сертификатами.",
    link: "/features/security",
    category: "Безопасность"
  },
  {
    icon: ArrowUpRight,
    title: "Рекомендации по улучшению",
    description: "Детальные рекомендации по улучшению контента, структуры и технических аспектов сайта.",
    link: "/features/recommendations",
    category: "Оптимизация"
  },
  {
    icon: Award,
    title: "Экспертная поддержка",
    description: "Доступ к команде SEO-экспертов, готовых помочь с интерпретацией данных и стратегией.",
    link: "/features/expert-support",
    category: "Поддержка"
  },
  {
    icon: Wifi,
    title: "Мониторинг доступности",
    description: "Отслеживание доступности вашего сайта 24/7 с мгновенными уведомлениями о проблемах.",
    link: "/features/uptime-monitoring",
    category: "Мониторинг"
  },
  {
    icon: Shield,
    title: "Защита от взлома",
    description: "Сканирование сайта на наличие уязвимостей, вредоносного кода и потенциальных угроз безопасности.",
    link: "/features/security-scanning",
    category: "Безопасность"
  },
  {
    icon: AlertTriangle,
    title: "Мониторинг ошибок",
    description: "Отслеживание и оповещение о критических ошибках на сайте и в консоли.",
    link: "/features/error-monitoring",
    category: "Мониторинг"
  },
  {
    icon: Database,
    title: "Анализ бэклинков",
    description: "Комплексный анализ обратных ссылок на ваш сайт с оценкой их качества и релевантности.",
    link: "/features/backlink-analysis",
    category: "Аналитика"
  },
  {
    icon: Code,
    title: "Оптимизация кода",
    description: "Автоматическое обнаружение и исправление проблем в коде, влияющих на SEO.",
    link: "/features/code-optimization",
    category: "Оптимизация"
  },
  {
    icon: FileSearch,
    title: "Анализ контента",
    description: "Оценка качества и уникальности контента с рекомендациями по улучшению.",
    link: "/features/content-analysis",
    category: "Аналитика"
  },
  {
    icon: Layers,
    title: "Многосайтовый мониторинг",
    description: "Отслеживание и сравнение показателей нескольких сайтов в едином интерфейсе.",
    link: "/features/multi-site-monitoring",
    category: "Мониторинг"
  },
  {
    icon: Share2,
    title: "Интеграции с сервисами",
    description: "Подключение к Google Analytics, Яндекс.Метрике и другим популярным сервисам.",
    link: "/features/service-integrations",
    category: "Интеграции"
  }
];

export const getFeaturesByCategory = () => {
  const categorizedFeatures: Record<string, FeatureData[]> = {};
  
  featuresData.forEach(feature => {
    const category = feature.category || 'Другое';
    if (!categorizedFeatures[category]) {
      categorizedFeatures[category] = [];
    }
    categorizedFeatures[category].push(feature);
  });
  
  return categorizedFeatures;
};
