
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
    icon: Search
  },
  {
    title: "Анализ метаданных",
    description: "Проверка тегов title, description и других метаданных для оптимизации.",
    blogId: 2,
    color: "#10B981",
    icon: FileSearch
  },
  {
    title: "Проверка скорости загрузки",
    description: "Анализ времени загрузки страниц и рекомендации по увеличению скорости.",
    blogId: 3,
    color: "#F59E0B",
    icon: Gauge
  },
  {
    title: "Проверка мобильной версии",
    description: "Тестирование адаптивности и удобства использования на мобильных устройствах.",
    blogId: 4,
    color: "#6366F1",
    icon: Smartphone
  },
  {
    title: "Анализ структуры URL",
    description: "Проверка ЧПУ и рекомендации по оптимизации URL-адресов.",
    blogId: 5,
    color: "#EC4899",
    icon: Link
  },
  {
    title: "Проверка robots.txt и sitemap",
    description: "Анализ файлов robots.txt и sitemap.xml для корректной индексации.",
    blogId: 6,
    color: "#8B5CF6",
    icon: FileJson
  },
  {
    title: "Ежедневное отслеживание позиций",
    description: "Мониторинг позиций вашего сайта в поисковых системах ежедневно.",
    blogId: 7,
    color: "#EF4444",
    icon: LineChart
  },
  {
    title: "Анализ конкурентов",
    description: "Сравнение ваших позиций с конкурентами для определения стратегии.",
    blogId: 8,
    color: "#14B8A6",
    icon: Users
  },
  {
    title: "Мониторинг ключевых слов",
    description: "Отслеживание изменений позиций по ключевым словам.",
    blogId: 9,
    color: "#F472B6",
    icon: KeyRound
  },
  {
    title: "Уведомления об изменениях",
    description: "Получение оповещений при значительном изменении позиций.",
    blogId: 10,
    color: "#06B6D4",
    icon: Bell
  },
  {
    title: "История изменений",
    description: "Доступ к истории изменений позиций для анализа прогресса.",
    blogId: 11,
    color: "#4F46E5",
    icon: History
  },
  {
    title: "Интеграция с Google Analytics",
    description: "Связь данных о позициях с аналитикой трафика.",
    blogId: 12,
    color: "#84CC16",
    icon: BarChart
  },
  {
    title: "Анализ контента",
    description: "Проверка уникальности и качества контента на вашем сайте.",
    blogId: 13,
    color: "#8B5CF6",
    icon: FileText
  },
  {
    title: "Безопасность данных",
    description: "Полная конфиденциальность и безопасность ваших данных.",
    blogId: 14,
    color: "#22C55E",
    icon: Shield
  },
  {
    title: "Интеграция с CMS",
    description: "Совместимость с популярными CMS-системами.",
    blogId: 15,
    color: "#F97316",
    icon: Database
  },
  {
    title: "Отчеты о производительности",
    description: "Детальные отчеты о производительности и рейтинге вашего сайта.",
    blogId: 16,
    color: "#0EA5E9",
    icon: PieChart
  }
];

