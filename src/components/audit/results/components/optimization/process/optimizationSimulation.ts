
interface OptimizationSimulationProps {
  url: string;
  onProgressUpdate: (progress: number, stage: string) => void;
}

export interface OptimizationResult {
  beforeScore: number;
  afterScore: number;
  demoPage: {
    title: string;
    content: string;
    meta: {
      description?: string;
      keywords?: string;
    };
    optimized: {
      content: string;
      meta?: {
        description?: string;
        keywords?: string;
      };
      score: number;
    };
    url: string;
  };
  metrics: {
    pages: number;
    fixedTitles: number;
    optimizedDescriptions: number;
    enhancedImages: number;
    fixedContent: number;
    fixedStructure: number;
    optimizationEfficiency: number;
  };
  optimizedPages: {
    critical: number;
    important: number;
    minor: number;
    total: number;
  };
}

export const runOptimizationSimulation = async (props: OptimizationSimulationProps): Promise<OptimizationResult> => {
  const { url, onProgressUpdate } = props;
  
  const stages = [
    'Анализ структуры сайта...',
    'Оптимизация мета-тегов...',
    'Улучшение структуры контента...',
    'Оптимизация изображений...',
    'Исправление проблем с URL...',
    'Устранение дублей контента...',
    'Улучшение семантической структуры...',
    'Оптимизация ключевых слов...',
    'Применение SEO-рекомендаций...',
    'Финальная проверка...',
    'Создание оптимизированной версии...'
  ];
  
  for (let i = 0; i < stages.length; i++) {
    onProgressUpdate((i / stages.length) * 100, stages[i]);
    
    const stepDuration = i === stages.length - 1 ? 1000 : 500 + Math.random() * 1500;
    const steps = 10;
    
    for (let j = 0; j <= steps; j++) {
      const progress = (i / stages.length) * 100 + ((1 / stages.length) * (j / steps) * 100);
      onProgressUpdate(progress, stages[i]);
      await new Promise(resolve => setTimeout(resolve, stepDuration / steps));
    }
  }
  
  const beforeScore = Math.floor(Math.random() * 40) + 30;
  const afterScore = Math.floor(Math.random() * 20) + 80;
  
  // Генерируем более детальную информацию о результатах оптимизации
  const totalPages = Math.floor(Math.random() * 200) + 50;
  const fixedTitles = Math.floor(totalPages * 0.7);
  const optimizedDescriptions = Math.floor(totalPages * 0.85);
  const enhancedImages = Math.floor(totalPages * 0.6);
  const fixedContent = Math.floor(totalPages * 0.75);
  const fixedStructure = Math.floor(totalPages * 0.65);
  
  // Распределение страниц по категориям важности
  const criticalPages = Math.floor(totalPages * 0.2);
  const importantPages = Math.floor(totalPages * 0.4);
  const minorPages = totalPages - criticalPages - importantPages;
  
  const optimizationEfficiency = ((afterScore - beforeScore) / (100 - beforeScore)) * 100;
  
  const demoPage = {
    title: `${url} - Главная страница`,
    url: url.startsWith('http') ? url : `https://${url}`,
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget felis eget urna malesuada maximus. 
              
Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed at lorem ut nunc fermentum laoreet.

Praesent nec nisi sed metus sollicitudin tincidunt vel nec arcu. Nullam tincidunt, dolor at posuere elementum, neque felis volutpat felis, vitae elementum turpis sem quis risus.`,
    meta: {
      description: 'Это описание страницы без ключевых слов и оптимизации для поисковых систем. Простой текст без структуры и оптимизации для SEO.',
      keywords: 'сайт, страница'
    },
    optimized: {
      content: `<h2>Великолепные возможности ${url}</h2>

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget felis eget urna malesuada maximus. Наши специалисты готовы предоставить вам полный набор инструментов для SEO-оптимизации.

<h3>Наши преимущества</h3>

Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed at lorem ut nunc fermentum laoreet. Мы используем передовые технологии для анализа и улучшения вашего сайта.

<h3>Инновационные решения для SEO</h3>

Praesent nec nisi sed metus sollicitudin tincidunt vel nec arcu. Nullam tincidunt, dolor at posuere elementum, neque felis volutpat felis, vitae elementum turpis sem quis risus. Оптимизация для поисковых систем - это наша специализация.

<ul>
  <li><strong>Высокое качество услуг</strong>: Мы предлагаем только лучшие решения для наших клиентов</li>
  <li><strong>Инновационный подход</strong>: Используем современные технологии для достижения результатов</li>
  <li><strong>Индивидуальные решения</strong>: Разрабатываем уникальные стратегии для каждого клиента</li>
  <li><strong>Поддержка 24/7</strong>: Наша команда всегда готова помочь вам с любыми вопросами</li>
</ul>

<div class="cta-section">
  <h4>Начните улучшать свой сайт уже сегодня!</h4>
  <p>Свяжитесь с нами для получения бесплатной консультации по оптимизации вашего сайта.</p>
  <a href="#contact" class="btn btn-primary">Получить консультацию</a>
</div>`,
      meta: {
        description: `${url} - ведущий сервис по предоставлению инновационных решений для SEO-оптимизации сайтов. Наша компания специализируется на разработке индивидуальных стратегий оптимизации и роста для клиентов по всему миру.`,
        keywords: 'оптимизация, SEO, инновации, качество, услуги, продвижение сайта, поисковые системы, аудит, мониторинг позиций, рост трафика, конверсия'
      },
      score: afterScore
    }
  };
  
  return {
    beforeScore,
    afterScore,
    demoPage,
    metrics: {
      pages: totalPages,
      fixedTitles,
      optimizedDescriptions,
      enhancedImages,
      fixedContent,
      fixedStructure,
      optimizationEfficiency: Math.round(optimizationEfficiency)
    },
    optimizedPages: {
      critical: criticalPages,
      important: importantPages,
      minor: minorPages,
      total: totalPages
    }
  };
};

/**
 * Форматирует URL для отображения
 */
export const formatUrl = (url: string): string => {
  // Удаляем протокол
  let formatted = url.replace(/^https?:\/\//, '');
  
  // Ограничиваем длину
  if (formatted.length > 40) {
    formatted = formatted.substring(0, 37) + '...';
  }
  
  return formatted;
};

/**
 * Определяет цвет оценки
 */
export const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-amber-500';
  return 'text-red-500';
};
