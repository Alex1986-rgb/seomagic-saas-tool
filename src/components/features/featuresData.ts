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
    category: "Аудит",
    content: `
### Что такое глубокий SEO-аудит?

Глубокий SEO-аудит - это комплексная проверка вашего сайта по более чем 100 факторам ранжирования. Мы анализируем техническое состояние сайта, структуру контента, внешние и внутренние ссылки и множество других параметров, влияющих на позиции в поисковых системах.

### Как это работает?

Наша система автоматически сканирует все страницы вашего сайта, анализируя каждую по десяткам параметров. Алгоритм выявляет критические ошибки, проблемы средней важности и незначительные недочеты, после чего формирует подробный отчет с рекомендациями.

### Что входит в аудит?

1. Анализ мета-тегов и заголовков
2. Проверка скорости загрузки страниц
3. Аудит структуры сайта и ссылочной массы
4. Анализ контента на уникальность и релевантность
5. Проверка мобильной версии сайта
6. Анализ индексации в поисковых системах
7. Оценка технических параметров (HTTP-заголовки, редиректы и др.)
8. Проверка микроразметки и структурированных данных
    `,
    benefits: [
      'Выявление всех факторов, негативно влияющих на ранжирование',
      'Четкие рекомендации по устранению проблем',
      'Приоритизация задач по их важности',
      'Отслеживание динамики показателей во времени',
      'Сравнение с конкурентами в вашей нише'
    ]
  },
  {
    icon: BarChart2,
    title: "Мониторинг позиций",
    description: "Отслеживание позиций вашего сайта по ключевым запросам в поисковых системах в режиме реального времени.",
    link: "/position-tracker",
    category: "Мониторинг",
    content: `
### Что такое мониторинг позиций?

Мониторинг позиций - это автоматическое отслеживание рейтинга вашего сайта в поисковых системах по выбранным ключевым словам. Наш сервис регулярно проверяет позиции вашего сайта в Google, Яндекс и других поисковиках, собирая данные для анализа.

### Почему это важно?

Позиции в поисковой выдаче напрямую влияют на органический трафик вашего сайта. Отслеживая изменения позиций, вы м��жете быстро реагировать на негативные тенденции и оценивать эффективность ваших SEO-мероприятий.

### Функциональные возможности

- Ежедневная проверка позиций по всем ключевым словам
- Мониторинг в разных регионах и на разных устройствах
- Детальная история изменений с построением графиков
- Отслеживание позиций конкурентов
- Уведомления об изменениях позиций по email и SMS
- Экспорт данных в различных форматах
    `,
    benefits: [
      'Оперативное обнаружение проблем с ранжированием',
      'Оценка эффективности SEO-оптимизации',
      'Анализ сезонности и трендов',
      'Сравнение с конкурентами',
      'Формирование оптимальной SEO-стратегии'
    ]
  },
  {
    icon: Globe,
    title: "Автоматическая оптимизация",
    description: "Интеллектуальные алгоритмы автоматически исправляют обнаруженные проблемы и улучшают SEO-показатели сайта.",
    link: "/features/optimization",
    category: "Оптимизация",
    content: `
### Что такое автоматическая оптимизация?

Автоматическая оптимизация - это инновационная технология, которая не только находит проблемы на вашем сайте, но и автоматически их исправляет. Система анализирует найденные ошибки и применяет необходимые изменения без вашего участия.

### Как это работает?

После проведения аудита система классифицирует обнаруженные проблемы и определяет, какие из них можно исправить автоматически. Для каждой проблемы создается оптимальное решение, которое затем применяется к сайту. Все изменения проходят проверку на безопасность и совместимость.

### Что может оптимизировать система?

- Исправление мета-тегов и заголовков
- Оптимизация изображений
- Исправление битых ссылок
- Генерация и добавление микроразметки
- Оптимизация CSS и JavaScript
- Создание карты сайта и файла robots.txt
- Исправление дублированного контента
- Настройка редиректов
    `,
    benefits: [
      'Экономия времени на рутинных SEO-задачах',
      'Предотвращение человеческих ошибок',
      'Мгновенное реагирование на обнаруженные проблемы',
      'Применение лучших практик SEO',
      'Постоянное совершенствование сайта'
    ]
  },
  {
    icon: Zap,
    title: "Ускорение загрузки",
    description: "Анализ и оптимизация скорости загрузки страниц для улучшения пользовательского опыта и ранжирования.",
    link: "/features/speed-optimization",
    category: "Оптимизация",
    content: `
### Что такое ускорение загрузки?

Ускорение загрузки - это комплекс мер по оптимизации производительности вашего сайта. Скорость загрузки страниц является одним из важнейших факторов как для пользовательского опыта, так и для ранжирования в поисковых системах.

### Почему с��орость так важна?

Исследования показывают, что 53% пользователей покидают сайт, если страница загружается дольше 3 секунд. Кроме того, Google официально учитывает скорость загрузки при ранжировании. Быстрый сайт - это больше конверсий и лучшие позиции в поиске.

### Как мы оптимизируем скорость?

- Сжатие и оптимизация изображений
- Минификация HTML, CSS и JavaScript
- Настройка браузерного кэширования
- Реализация ленивой загрузки
- Оптимизация порядка загрузки ресурсов
- Использование CDN
- Оптимизация работы с базой данных
- Реализация технологии AMP
    `,
    benefits: [
      'Улучшение пользовательского опыта',
      'Повышение позиций в поисковых системах',
      'Увеличение конверсии',
      'Снижение показателя отказов',
      'Оптимизация для мобильных устройств'
    ]
  },
  {
    icon: PieChart,
    title: "Анализ конкурентов",
    description: "Сравнение вашего сайта с конкурентами и выявление их сильных сторон для улучшения вашей стратегии.",
    link: "/features/competitor-analysis",
    category: "Аналитика",
    content: `
### Что такое анализ конкурентов?

Анализ конкурентов - это процесс оценки вашего сайта в контексте конкурентов в вашей нише. Мы сравниваем ваш сайт с аналогичными сайтами, анализируем их структуру, контент и SEO-стратегию, чтобы выявить их сильные стороны и слабые места.

### Как это работает?

Наша система автоматически собирает данные о конкурентах, анализируя их структуру, контент и мета-теги. Мы выделяем ключевые различия и формируем отчет с рекомендациями по улучшению.

### Что включает в себя анализ конкурентов?

1. Сравнение структуры сайта
2. Анализ контента и мета-тегов
3. Оценка SEO-стратегии
4. Выявление сильных сторон конкурентов
5. Построение рекомендаций по улучшению
    `,
    benefits: [
      'Получение полного представления о конкурентной среде',
      'Оценка эффективности SEO-стратегии',
      'Построение оптимальной стратегии для улучшения',
      'Выявление сильных сторон конкурентов',
      'Получение рекомендаций по улучшению'
    ]
  },
  {
    icon: LineChart,
    title: "Аналитика роста",
    description: "Наглядная визуализация роста трафика и улучшения позиций с течением времени.",
    link: "/features/growth-analytics",
    category: "Аналитика",
    content: `
### Что такое аналитика роста?

Аналитика роста - это процесс отслеживания изменения трафика и позиций вашего сайта с течением времени. Мы используем различные метрики, такие как количество посетителей, количество поисковых запросов и позиции в поисковых системах, чтобы выявить тенденции и определить эффективность ваших SEO-мероприятий.

### Как это работает?

Наша система автоматически собирает данные о трафике и позициях вашего сайта, анализируя их с течением времени. Мы строим графики и отчеты, которые помогают вам видеть изменения и определить, какие действия принесли наибольший эффект.

### Что включает в себя аналитика роста?

1. Отслеживание изменения трафика
2. Анализ позиций в поисковых системах
3. Сравнение с конкурентами
4. Построение графиков и отчетов
5. Оценка эффективности SEO-стратегии
    `,
    benefits: [
      'Получение полного представления о росте трафика',
      'Оценка эффективности SEO-стратегии',
      'Построение оптимальной стратегии для улучшения',
      'Выявление сильных сторон конкурентов',
      'Получение рекомендаций по улучшению'
    ]
  },
  {
    icon: Settings,
    title: "Настраиваемые отчеты",
    description: "Создание персонализированных отчетов для клиентов и руководства с фокусом на нужных метриках.",
    link: "/features/custom-reports",
    category: "Отчеты",
    content: `
### Что такое настраиваемые отчеты?

Настраиваемые отчеты - это возможность создавать и настраивать отчеты для клиентов и руководства с фокусом на нужных метриках. Мы предоставляем широкий выбор параметров и функций, чтобы вы могли получить полезную информацию о вашем сайте.

### Как это работает?

Наша система позволяет создавать и настраивать отчеты с использованием различных параметров и функций. Вы можете выбрать необходимые метрики, добавить графики и таблицы, а также настроить формат отчета.

### Что включает в себя настраиваемые отчеты?

1. Создание и настройка отчетов
2. Выбор метрик и параметров
3. Добавление графиков и таблиц
4. Настройка формата отчета
5. Построение и отправка отчетов
    `,
    benefits: [
      'Получение полного представления о вашем сайте',
      'Оценка эффективности SEO-стратегии',
      'Построение оптимальной стратегии для улучшения',
      'Выявление сильных сторон конкурентов',
      'Получение рекомендаций по улучшению'
    ]
  },
  {
    icon: AlarmClock,
    title: "Автоматические проверки",
    description: "Регулярные автоматические проверки сайта на появление новых ошибок и проблем с оповещениями.",
    link: "/features/automated-checks",
    category: "Мониторинг",
    content: `
### Что такое автоматические проверки?

Автоматические проверки - это технология, которая регулярно проверяет ваш сайт на наличие новых ошибок и проблем. Мы используем различные инструменты и алгоритмы для обнаружения и исправления проблем.

### Как это работает?

Наша система автоматически проверяет ваш сайт на наличие новых ошибок и проблем, используя различные инструменты и алгоритмы. Мы выделяем критические ошибки и проблемы и формируем отчет с рекомендациями по устранению.

### Что включает в себя автоматические проверки?

1. Автоматическая проверка на наличие ошибок
2. Оценка качества контента
3. Проверка структуры сайта
4. Анализ мета-тегов и заголовков
5. Проверка скорости загрузки страниц
6. Оценка индексации в поисковых системах
7. Проверка технических параметров
8. Проверка микроразметки и структурированных данных
    `,
    benefits: [
      'Оперативное обнаружение проблем с ранжированием',
      'Оценка эффективности SEO-оптимизации',
      'Анализ сезонности и трендов',
      'Сравнение с конкурентами',
      'Формирование оптимальной SEO-стратегии'
    ]
  },
  {
    icon: Check,
    title: "Валидация разметки",
    description: "Проверка корректности HTML, JSON-LD и микроразметки для правильного отображения в поиске.",
    link: "/features/markup-validation",
    category: "Аудит",
    content: `
### Что такое валидация разметки?

Валидация разметки - это процесс проверки корректности HTML, JSON-LD и микроразметки вашего сайта. Мы используем специальные инструменты и алгоритмы для обнаружения и исправления ошибок.

### Как это работает?

Наша система автоматически проверяет ваш сайт на наличие ошибок в HTML, JSON-LD и микроразметке, используя специальные инструменты и алгоритмы. Мы выделяем критические ошибки и проблемы и формируем отчет с рекомендациями по устранению.

### Что включает в себя валидацию разметки?

1. Проверка HTML
2. Проверка JSON-LD
3. Проверка микроразметки
4. Оценка качества контента
5. Проверка структуры сайта
6. Анализ мета-тегов и заголовков
7. Проверка скорости загрузки страниц
8. Оценка индексации в поисковых системах
9. Проверка технических параметров
10. Проверка микроразметки и структурированных данных
    `,
    benefits: [
      'Проверка корректности HTML, JSON-LD и микроразметки',
      'Предотвращение человеческих ошибок',
      'Мгновенное реагирование на обнаруженные проблемы',
      'Применение лучших практик SEO',
      'Постоянное совершенствование сайта'
    ]
  },
  {
    icon: Lock,
    title: "Безопасность сайта",
    description: "Проверка на наличие уязвимостей, вредоносного кода и проблем с SSL-сертификатами.",
    link: "/features/security",
    category: "Безопасность",
    content: `
### Что такое безопасность сайта?

Безопасность сайта - это процесс проверки на наличие уязвимостей, вредоносного кода и проблем с SSL-сертификатами. Мы используем специальные инструменты и алгоритмы для обнаружения и исправления проблем.

### Как это работает?

Наша система автоматически проверяет ваш сайт на наличие уязвимостей, вредоносного кода и проблем с SSL-сертификатами, используя специальные инструменты и алгоритмы. Мы выделяем критические ошибки и проблемы и формируем отчет с рекомендациями по устранению.

### Что включает в себя безопасность сайта?

1. Проверка на наличие уязвимостей
2. Проверка на наличие вредоносного кода
3. Проверка SSL-сертификатов
4. Оценка качества контента
5. Проверка структуры сайта
6. Анализ мета-тегов и заголовков
7. Проверка скорости загрузки страниц
8. Оценка индексации в поисковых системах
9. Проверка технических параметров
10. Проверка микроразметки и структурированных данных
    `,
    benefits: [
      'Проверка на наличие уязвимостей, вредоносного кода и проблем с SSL-сертификатами',
      'Предотвращение человеческих ошибок',
      'Мгновенное реагирование на обнаруженные проблемы',
      'Применение лучших практик SEO',
      'Постоянное совершенствование сайта'
    ]
  },
  {
    icon: ArrowUpRight,
    title: "Рекомендации по улучшению",
    description: "Детальные рекомендации по улучшению контента, структуры и технических аспектов сайта.",
    link: "/features/recommendations",
    category: "Оптимизация",
    content: `
### Что такое рекомендации по улучшению?

Рекомендации по улучшению - это процесс предоставления детальных рекомендаций по улучшению контента, структуры и технических аспектов вашего сайта. Мы используем специальные инструменты �� алгоритмы для анализа и формирования рекомендаций.

### Как это работает?

Наша система автоматически анализирует ваш сайт и формирует детальные рекомендации по улучшению контента, структуры и технических аспектов. Мы выделяем критические ошибки и проблемы и формируем отчет с рекомендациями по устранению.

### Что включает в себя рекомендации по улучшению?

1. Анализ контента
2. Анализ структуры сайта
3. Анализ технических параметров
4. Построение рекомендаций по улучшению
5. Оценка качества контента
6. Проверка структуры сайта
7. Анализ мета-тегов и заголовков
8. Проверка скорости загрузки страниц
9. Оценка индексации в поисковых системах
10. Проверка технических параметров
11. Проверка микроразметки и структурированных данных
    `,
    benefits: [
      'Предотвращение человеческих ошибок',
      'Мгновенное реагирование на обнаруженные проблемы',
      'Применение лучших практик SEO',
      'Постоянное совершенствование сайта',
      'Получение полного представления о вашем сайте'
    ]
  },
  {
    icon: Award,
    title: "Экспертная поддержка",
    description: "Доступ к команде SEO-экспертов, готовых помочь с интерпретацией данных и стратегией.",
    link: "/features/expert-support",
    category: "Поддержка",
    content: `
### Что такое экспертная поддержка?

Экспертная поддержка - это процесс предоставления доступа к команде SEO-экспертов, готовых помочь с интерпретацией данных и стратегией. Мы используем специальные инструменты и алгоритмы для анализа и формирования рекомендаций.

### Как это работает?

Наша система автоматически анализирует ваш сайт и формирует детальные рекомендации по улучшению контента, структуры и технических аспектов. Мы выделяем критические ошибки и проблемы и формируем отчет с рекомендациями по устранению.

### Что включает в себя экспертную поддержку?

1. Анализ контента
2. Анализ структуры сайта
3. Анализ технических параметров
4. Построение рекомендаций по улучшению
5. Оценка качества контента
6. Проверка структуры сайта
7. Анализ мета-тегов и заголовков
8. Проверка скорости загрузки страниц
9. Оценка индексации в поисковых системах
10. Проверка технических параметров
11. Проверка микроразметки и структурированных данных
    `,
    benefits: [
      'Предотвращение человеческих ошибок',
      'Мгновенное реагирование на обнаруженные проблемы',
      'Применение лучших практик SEO',
      'Постоянное совершенствование сайта',
      'Получение полного представления о вашем сайте'
    ]
  },
  {
    icon: Wifi,
    title: "Мониторинг доступности",
    description: "Отслеживание доступности вашего сайта 24/7 с мгновенными уведомлениями о проблемах.",
    link: "/features/uptime-monitoring",
    category: "Мониторинг",
    content: `
### Что такое мониторинг доступности?

Мониторинг доступности - это процесс отслеживания доступности вашего сайта 24/7 с мгновенными уведомлениями о проблемах. Мы используем специальные инструменты и алгоритмы для обнаружения и исправления проблем.

### Как это работает?

Наша система автоматически проверяет ваш сайт на наличие проблем с доступностью, используя специальные инструменты и алгоритмы. Мы выделяем критические ошибки и проблемы и формируем отчет с рекомендациями по устранению.

### Что включает в себя мониторинг доступности?

1. Автоматическая проверка на наличие ошибок
2. Оценка качества контента
3. Проверка структуры сайта
4. Анализ мета-тегов и заголовков
5. Проверка скорости загрузки страниц
6. Оценка индексации в поисковых системах
7. Проверка технических параметров
8. Проверка микроразметки и структурированных данных
    `,
    benefits: [
      'Оперативное обнаружение проблем с ранжированием',
      'Оценка эффективности SEO-оптимизации',
      'Анализ сезонности и трендов',
      'Сравнение с конкурентами',
      'Формирование оптимальной SEO-стратегии'
    ]
  },
  {
    icon: Shield,
    title: "Защита от взлома",
    description: "Сканирование сайта на наличие уязвимостей, вредоносного кода и потенциальных угроз безопасности.",
    link: "/features/security-scanning",
    category: "Безопасность",
    content: `
### Что такое защита от взлома?

Защита от взлома - это процесс сканирования сайта на наличие уязвимостей, вредоносного кода и потенциальных угроз безопасности. Мы используем специальные инструменты и алгоритмы для обнаружения и исправления проблем.

### Как это работает?

Наша система автоматически проверяет ваш сайт на наличие уязвимостей, вредоносного кода и потенциальных угроз безопасности, используя специальные инструменты и алгоритмы. Мы выделяем критические ошибки и проблемы и формируем отчет с рекомендациями по устранению.

### Что включает в себя защиту от взлома?

1. Проверка на наличие уязвимосте��
2. Проверка на наличие вредоносного кода
3. Проверка SSL-сертификатов
4. Оценка качества контента
5. Проверка структуры сайта
6. Анализ мета-тегов и заголовков
7. Проверка скорости загрузки страниц
8. Оценка индексации в поисковых системах
9. Проверка технических параметров
10. Проверка микроразметки и структурированных данных
    `,
    benefits: [
      'Проверка на наличие уязвимостей, вредоносного кода и потенциальных угроз безопасности',
      'Предотвращение человеческих ошибок',
      'Мгновенное реагирование на обнаруженные проблемы',
      'Применение лучших практик SEO',
      'Постоянное совершенствование сайта'
    ]
  },
  {
    icon: AlertTriangle,
    title: "Мониторинг ошибок",
    description: "Отслеживание и оповещение о критических ошибках на сайте и в консоли.",
    link: "/features/error-monitoring",
    category: "Мониторинг",
    content: `
### Что такое мониторинг ошибок?

Мониторинг ошибок - это процесс отслеживания и оповещения о критических ошибках на сайте и в консоли. Мы используем специальные инструменты и алгоритмы для обнаружения и исправления проблем.

### Как это работает?

Наша система автоматически проверяет ваш сайт на наличие критических ошибок, используя специальные инструменты и алгоритмы. Мы выделяем критические ошибки и проблемы и формируем отчет с рекомендациями по устранению.

### Что включает в себя мониторинг ошибок?

1. Автоматическая проверка на наличие ошибок
2. Оценка качества контента
3. Проверка структуры сайта
4. Анализ мета-тегов и заголовков
5. Проверка скорости загрузки страниц
6. Оценка индексации в поисковых системах
7. Проверка технических параметров
8. Проверка микроразметки и структурированных данных
    `,
    benefits: [
      'Оперативное обнаружение проблем с ранжированием',
      'Оценка эффективности SEO-оптимизации',
      'Анализ сезонности и трендов',
      'Сравнение с конкурентами',
      'Формирование оптимальной SEO-стратегии'
    ]
  },
  {
    icon: Database,
    title: "Анализ бэклинков",
    description: "Комплексный анализ обратных ссылок на ваш сайт с оценкой их качества и релевантности.",
    link: "/features/backlink-analysis",
    category: "Аналитика",
    content: `
### Что такое анализ бэклинков?

Анализ бэклинков - это процесс комплексного анализа обратных ссылок на ваш сайт с оценкой их качества и релевантности. Мы используем специальные инструменты и алгоритмы для обнаружения и анализа обратных ссылок.

### Как это работает?

Наша система автоматически собирает данные о обратных ссылках на ваш сайт, анализируя их качество и релевантность. Мы выделяем ключевые различия и формируем отчет с рекомендациями по улучшению.

### Что включает в себя анализ бэклинков?

1. Сбор данных о обратных ссылках
2. Анализ качества и релевантности
3. Построение графиков и отчетов
4. Оценка эффективности SEO-стратегии
5. Выявление сильных сторон конкурентов
6. Построение рекомендаций по улучшению
    `,
    benefits: [
      'Получение полного представления о росте трафика',
      'Оценка эффективности SEO-стратегии',
      'Построение оптимальной стратегии для улучшения',
      'Выявление сильных сторон конкурентов',
      'Получение рекомендаций по улучшению'
    ]
  },
  {
    icon: Code,
    title: "Оптимизация кода",
    description: "Автоматическое обнаружение и исправление проблем в коде, влияющих на SEO.",
    link: "/features/code-optimization",
    category: "Оптимизация",
    content: `
### Что такое оптимизация кода?

Оптимизация кода - это процесс автоматического обнаружения и исправления проблем в коде, влияющих на SEO. Мы используем специальные инструменты и алгоритмы для обнаружения и исправления проблем.

### Как это работает?

Наша система автоматически анализирует ваш сайт и обнаруживает проблемы в коде, влияющие на SEO. Мы выделяем критические ошибки и проблемы и формируем отчет с рекомендациями по устранению.

### Что включает в себя оптимизацию кода?

1. Анализ HTML, CSS и JavaScript
2. Проверка на наличие ошибок
3. Построение рекомендаций по устранению
4. Оценка качества контента
5. Проверка структуры сайта
6. Анализ мета-тегов и заголовков
7. Проверка скорости загрузки страниц
8. Оценка индексации в поисковых системах
9. Проверка технических параметров
10. Проверка микроразметки и структурированных данных
    `,
    benefits: [
      'Предотвращение человеческих ошибок',
      'Мгновенное реагирование на обнаруженные проблемы',
      'Применение лучших практик SEO',
      'Постоянное совершенствование сайта',
      'Получение полного представления о вашем сайте'
    ]
  },
  {
    icon: FileSearch,
    title: "Анализ контента",
    description: "Оценка качества и уникальности контента с рекомендациями по улучшению.",
    link: "/features/content-analysis",
    category: "Аналитика",
    content: `
### Что такое анализ контента?

Анализ контента - это процесс оценки качества и уникальности контента с рекомендациями по улучшению. Мы используем специальные инструменты и алгоритмы для анализа контента.

### Как это работает?

Наша система автоматически анализирует ваш контент и выделяет ключевые различия. Мы выделяем критические ошибки и проблемы и формируем отчет с рекомендациями по улучшению.

### Что включает в себя анализ контента?

1. Анализ качества контента
2. Построение графиков и отчетов
3. Оценка эффективности SEO-стратегии
4. Выявление сильных сторон конкурентов
5. Построение рекомендаций по улучшению
    `,
    benefits: [
      'Получение полного представления о вашем сайте',
      'Оценка эффективности SEO-стратегии',
      'Построение оптимальной стратегии для улучшения',
      'Выявление сильных сторон конкурентов',
      'Получение рекомендаций по улучшению'
    ]
  },
  {
    icon: Layers,
    title: "Многосайтовый мониторинг",
    description: "Отслеживание и сравнение показателей нескольких сайтов в едином интерфейсе.",
    link: "/features/multi-site-monitoring",
    category: "Мониторинг",
    content: `
### Что такое многосайтовый мониторинг?

Многосайтовый мониторинг - это процесс отслеживания и сравнения показателей нескольких сайтов в едином интерфейсе. Мы используем специальные инструменты и алгоритмы для анализа и сравнения данных.

### Как это работает?

Наша система автоматически собирает данные о показателях нескольких сайтов и формирует отчеты с сравнением.

### Что включает в себя многосайтовый мониторинг?

1. Сбор данных о показателях нескольких сайтов
2. Формирование отчетов с сравнением
3. Оценка эффективности SEO-стратегии
4. Выявление сильных сторон конкурентов
5. Построение рекомендаций по улучшению
    `,
    benefits: [
      'Получение полного представления о вашем сайте',
      'Оценка эффективности SEO-стратегии',
      'Построение оптимальной стратегии для улучшения',
      'Выявление сильных сторон конкурентов',
      'Получение рекомендаций по улучшению'
    ]
  },
  {
    icon: Share2,
    title: "Интеграции с сервисами",
    description: "Подключение к Google Analytics, Яндекс.Метрике и другим популярным сервисам.",
    link: "/features/service-integrations",
    category: "Интеграции",
    content: `
### Что такое интеграции с сервисами?

Интеграции с сервисами - это процесс подключения вашего сайта к Google Analytics, Яндекс.Метрике и другим популярным сервисам. Мы используем специальные инструменты и алгоритмы для подключения и настройки интеграций.

### Как это работает?

Наша система автоматически подключает ваш сайт к Google Analytics, Яндекс.Метрике и другим популярным сервисам, настраивает их и предоставляет доступ к данным.

### Что включает в себя интеграции с сервисами?

1. Подключение к Google Analytics
2. Подключение к Яндекс.Метрике
3. Подключение к другим популярным сервисам
4. Настройка интеграций
5. Построение отчетов и аналитики
    `,
    benefits: [
      'Получение полного представления о вашем сайте',
      'Оценка эффективности SEO-стратегии',
      'Построение оптимальной стратегии для улучшения',
      'Выявление сильных сторон конкурентов',
      'Получение рекомендаций по улучшению'
    ]
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

// Функция для получения всех функций без разделения на категории
export const getAllFeatures = () => {
  const categorizedFeatures = getFeaturesByCategory();
  const allFeatures = Object.values(categorizedFeatures).flat();
  return allFeatures;
};
