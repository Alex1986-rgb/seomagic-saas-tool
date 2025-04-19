import { Check, Search, LineChart, BarChart3, Globe, Code, FileText, Users, Settings, Lock, Bell, Database, Layers, Zap, BarChart2, Star } from 'lucide-react';
import { Feature, FeatureCategory, FeatureData } from './types';

// SEO Audit Features
const auditFeatures: Feature[] = [
  {
    title: 'Полное сканирование сайта',
    description: 'Глубокий анализ всех страниц вашего сайта для обнаружения SEO проблем.',
    icon: Search,
    category: 'SEO Аудит'
  },
  {
    title: 'Анализ метаданных',
    description: 'Проверка тегов title, description и других метаданных для оптимизации.',
    icon: FileText,
    category: 'SEO Аудит'
  },
  {
    title: 'Проверка скорости загрузки',
    description: 'Анализ времени загрузки страниц и рекомендации по увеличению скорости.',
    icon: Zap,
    category: 'SEO Аудит'
  },
  {
    title: 'Проверка мобильной версии',
    description: 'Тестирование адаптивности и удобства использования на мобильных устройствах.',
    icon: Settings,
    category: 'SEO Аудит'
  },
  {
    title: 'Анализ структуры URL',
    description: 'Проверка ЧПУ и рекомендации по оптимизации URL-адресов.',
    icon: Globe,
    category: 'SEO Аудит'
  },
  {
    title: 'Проверка robots.txt и sitemap',
    description: 'Анализ файлов robots.txt и sitemap.xml для корректной индексации.',
    icon: Code,
    category: 'SEO Аудит'
  }
];

// Position Tracking Features
const positionTrackingFeatures: Feature[] = [
  {
    title: 'Ежедневное отслеживание позиций',
    description: 'Мониторинг позиций вашего сайта в поисковых системах ежедневно.',
    icon: LineChart,
    category: 'Отслеживание позиций'
  },
  {
    title: 'Анализ конкурентов',
    description: 'Сравнение ваших позиций с конкурентами для определения стратегии.',
    icon: Users,
    category: 'Отслеживание позиций'
  },
  {
    title: 'Мониторинг ключевых слов',
    description: 'Отслеживание изменений позиций по ключевым словам.',
    icon: BarChart3,
    category: 'Отслеживание позиций'
  },
  {
    title: 'Уведомления об изменениях',
    description: 'Получение оповещений при значительном изменении позиций.',
    icon: Bell,
    category: 'Отслеживание позиций'
  },
  {
    title: 'История изменений',
    description: 'Доступ к истории изменений позиций для анализа прогресса.',
    icon: Database,
    category: 'Отслеживание позиций'
  },
  {
    title: 'Интеграция с Google Analytics',
    description: 'Связь данных о позициях с аналитикой трафика.',
    icon: BarChart2,
    category: 'Отслеживание позиций'
  }
];

// Other Features
const otherFeatures: Feature[] = [
  {
    title: 'Анализ контента',
    description: 'Проверка уникальности и качества контента на вашем сайте.',
    icon: FileText,
    category: 'Дополнительные возможности'
  },
  {
    title: 'Безопасность данных',
    description: 'Полная конфиденциальность и безопасность ваших данных.',
    icon: Lock,
    category: 'Дополнительные возможности'
  },
  {
    title: 'Интеграция с CMS',
    description: 'Совместимость с популярными CMS-системами.',
    icon: Layers,
    category: 'Дополнительные возможности'
  },
  {
    title: 'Отчеты о производительности',
    description: 'Детальные отчеты о производительности и рейтинге вашего сайта.',
    icon: Star,
    category: 'Дополнительные возможности'
  }
];

// Feature Categories
export const featureCategories: FeatureCategory[] = [
  { title: 'SEO Аудит', features: auditFeatures },
  { title: 'Отслеживание позиций', features: positionTrackingFeatures },
  { title: 'Дополнительные возможности', features: otherFeatures }
];

// Get all features
export const getAllFeatures = (): Feature[] => {
  return [...auditFeatures, ...positionTrackingFeatures, ...otherFeatures];
};

// Create and export featuresData array as it's being referenced in other files
export const featuresData: FeatureData[] = getAllFeatures().map(feature => ({
  ...feature,
  category: feature.category || 'Общие функции' // Ensure category is always present
})) as FeatureData[];
