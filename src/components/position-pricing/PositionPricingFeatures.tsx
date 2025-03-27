
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  LineChart, 
  TrendingUp, 
  MapPin, 
  Bell, 
  FileText, 
  Share2, 
  User, 
  Code, 
  Settings
} from 'lucide-react';

const PositionPricingFeatures: React.FC = () => {
  const features = [
    {
      icon: <Search className="h-8 w-8 text-primary" />,
      title: "Мониторинг позиций",
      description: "Отслеживайте позиции вашего сайта по ключевым запросам в Яндекс, Google и других поисковых системах."
    },
    {
      icon: <LineChart className="h-8 w-8 text-primary" />,
      title: "История изменений",
      description: "Анализируйте исторические данные для оценки эффективности SEO-стратегии и корректировки действий."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: "Динамика позиций",
      description: "Наглядные графики и отчеты о динамике позиций, средних показателях и трендах роста."
    },
    {
      icon: <MapPin className="h-8 w-8 text-primary" />,
      title: "Региональность",
      description: "Проверка позиций с учетом региональной выдачи в разных городах и странах."
    },
    {
      icon: <Bell className="h-8 w-8 text-primary" />,
      title: "Уведомления",
      description: "Настраиваемые уведомления о значительных изменениях позиций по email или в личном кабинете."
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Отчеты",
      description: "Автоматическое формирование и отправка отчетов по расписанию в различных форматах."
    },
    {
      icon: <Share2 className="h-8 w-8 text-primary" />,
      title: "Интеграции",
      description: "Интеграция с Google Analytics, Яндекс.Метрикой и другими аналитическими сервисами."
    },
    {
      icon: <User className="h-8 w-8 text-primary" />,
      title: "Мультипользовательский доступ",
      description: "Возможность предоставления доступа команде с разграничением прав просмотра и редактирования."
    },
    {
      icon: <Code className="h-8 w-8 text-primary" />,
      title: "API доступ",
      description: "Получение данных через API для интеграции с вашими системами и инструментами."
    },
    {
      icon: <Settings className="h-8 w-8 text-primary" />,
      title: "Гибкая настройка",
      description: "Настройка частоты проверок, группировка ключевых слов, фильтрация и сортировка данных."
    }
  ];

  return (
    <div className="mb-20">
      <h2 className="text-3xl font-bold text-center mb-2">Возможности мониторинга позиций</h2>
      <p className="text-muted-foreground max-w-3xl mx-auto text-center mb-12">
        Полный набор инструментов для отслеживания и анализа позиций вашего сайта в поисковых системах
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            viewport={{ once: true }}
            className="bg-muted/30 p-6 rounded-lg"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-16 bg-gradient-to-r from-primary/10 to-primary/5 p-8 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4">Дополнительные возможности анализа</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Search className="h-5 w-5 text-primary mr-2 mt-1" />
                <div>
                  <span className="font-medium">Поиск битых ссылок и редиректов:</span> 
                  <p className="text-sm text-muted-foreground">Выявляет неработающие ссылки и перенаправления, улучшая навигацию и пользовательский опыт.</p>
                </div>
              </li>
              <li className="flex items-start">
                <Search className="h-5 w-5 text-primary mr-2 mt-1" />
                <div>
                  <span className="font-medium">Обнаружение дубликатов страниц:</span> 
                  <p className="text-sm text-muted-foreground">Находит повторяющиеся страницы, мета-теги и заголовки, устраняя избыточный контент.</p>
                </div>
              </li>
              <li className="flex items-start">
                <Search className="h-5 w-5 text-primary mr-2 mt-1" />
                <div>
                  <span className="font-medium">Генерация карты сайта:</span> 
                  <p className="text-sm text-muted-foreground">Автоматически создает файл sitemap.xml, упрощая индексацию сайта поисковыми системами.</p>
                </div>
              </li>
              <li className="flex items-start">
                <Search className="h-5 w-5 text-primary mr-2 mt-1" />
                <div>
                  <span className="font-medium">Визуализация структуры сайта:</span> 
                  <p className="text-sm text-muted-foreground">Представляет ссылочные связи графически, позволяя оценить внутреннюю перелинковку.</p>
                </div>
              </li>
              <li className="flex items-start">
                <Search className="h-5 w-5 text-primary mr-2 mt-1" />
                <div>
                  <span className="font-medium">Расчет внутреннего PageRank:</span> 
                  <p className="text-sm text-muted-foreground">Вычисляет внутренний вес страниц, определяя их значимость в структуре сайта.</p>
                </div>
              </li>
              <li className="flex items-start">
                <Search className="h-5 w-5 text-primary mr-2 mt-1" />
                <div>
                  <span className="font-medium">Проверка уникальности контента:</span> 
                  <p className="text-sm text-muted-foreground">Ищет дубликаты страниц и проверяет тексты на уникальность внутри сайта.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="bg-background p-6 rounded-lg">
            <h4 className="text-xl font-semibold mb-4">Комплексный анализ вашего сайта</h4>
            <p className="text-muted-foreground mb-4">
              Получите полный набор инструментов для SEO-аудита и оптимизации вашего сайта.
              Все возможности доступны в рамках единой платформы.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <h5 className="font-medium mb-2">SEO-аудит</h5>
                <p className="text-sm text-muted-foreground">Комплексный анализ всех SEO-факторов вашего сайта</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <h5 className="font-medium mb-2">Мониторинг позиций</h5>
                <p className="text-sm text-muted-foreground">Отслеживание позиций во всех поисковых системах</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <h5 className="font-medium mb-2">Технический анализ</h5>
                <p className="text-sm text-muted-foreground">Проверка технических аспектов и исправление ошибок</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <h5 className="font-medium mb-2">Контент-анализ</h5>
                <p className="text-sm text-muted-foreground">Оценка качества и уникальности контента</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionPricingFeatures;
