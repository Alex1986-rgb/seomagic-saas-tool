import { SlideData } from './types';
import { 
  Search, FileSearch, Gauge, Smartphone, Link, 
  FileJson, LineChart, Users, KeyRound, Bell,
  History, BarChart, FileText, Shield, Database, 
  PieChart
} from 'lucide-react';

export const getSlideData = (): SlideData[] => [
  {
    title: "Полное сканирование сайта",
    description: "Глубокий анализ всех страниц вашего сайта для обнаружения SEO проблем.",
    blogId: 1,
    color: "#3B82F6",
    icon: Search,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
  },
  {
    title: "Анализ метаданных",
    description: "Проверка тегов title, description и других метаданных для оптимизации.",
    blogId: 2,
    color: "#10B981",
    icon: FileSearch,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
  },
  {
    title: "Проверка скорости загрузки",
    description: "Анализ времени загрузки страниц и рекомендации по увеличению скорости.",
    blogId: 3,
    color: "#F59E0B",
    icon: Gauge,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
  },
  {
    title: "Проверка мобильной версии",
    description: "Тестирование адаптивности и удобства использования на мобильных устройствах.",
    blogId: 4,
    color: "#6366F1",
    icon: Smartphone,
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1"
  },
  {
    title: "Анализ структуры URL",
    description: "Проверка ЧПУ и рекомендации по оптимизации URL-адресов.",
    blogId: 5,
    color: "#EC4899",
    icon: Link,
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
  },
  {
    title: "Проверка robots.txt и sitemap",
    description: "Анализ файлов robots.txt и sitemap.xml для корректной индексации.",
    blogId: 6,
    color: "#8B5CF6",
    icon: FileJson,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    title: "Ежедневное отслеживание позиций",
    description: "Мониторинг позиций вашего сайта в поисковых системах ежедневно.",
    blogId: 7,
    color: "#EF4444",
    icon: LineChart,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    title: "Анализ конкурентов",
    description: "Сравнение ваших позиций с конкурентами для определения стратегии.",
    blogId: 8,
    color: "#14B8A6",
    icon: Users,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    title: "Мониторинг ключевых слов",
    description: "Отслеживание изменений позиций по ключевым словам.",
    blogId: 9,
    color: "#F472B6",
    icon: KeyRound,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    title: "Уведомления об изменениях",
    description: "Получение оповещений при значительном изменении позиций.",
    blogId: 10,
    color: "#06B6D4",
    icon: Bell,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    title: "История изменений",
    description: "Доступ к истории изменений позиций для анализа прогресса.",
    blogId: 11,
    color: "#4F46E5",
    icon: History,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    title: "Интеграция с Google Analytics",
    description: "Связь данных о позициях с аналитикой трафика.",
    blogId: 12,
    color: "#84CC16",
    icon: BarChart,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    title: "Анализ контента",
    description: "Проверка уникальности и качества контента на вашем сайте.",
    blogId: 13,
    color: "#8B5CF6",
    icon: FileText,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    title: "Безопасность данных",
    description: "Полная конфиденциальность и безопасность ваших данных.",
    blogId: 14,
    color: "#22C55E",
    icon: Shield,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    title: "Интеграция с CMS",
    description: "Совместимость с популярными CMS-системами.",
    blogId: 15,
    color: "#F97316",
    icon: Database,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  },
  {
    title: "Отчеты о производительности",
    description: "Детальные отчеты о производительности и рейтинге вашего сайта.",
    blogId: 16,
    color: "#0EA5E9",
    icon: PieChart,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
  }
];
