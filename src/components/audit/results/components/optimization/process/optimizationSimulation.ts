
interface OptimizationSimulationProps {
  url: string;
  onProgressUpdate: (progress: number, stage: string) => void;
}

export const runOptimizationSimulation = async (props: OptimizationSimulationProps) => {
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
  
  const demoPage = {
    title: `${url} - Главная страница`,
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget felis eget urna malesuada maximus. 
              
Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed at lorem ut nunc fermentum laoreet.

Praesent nec nisi sed metus sollicitudin tincidunt vel nec arcu. Nullam tincidunt, dolor at posuere elementum, neque felis volutpat felis, vitae elementum turpis sem quis risus.`,
    meta: {
      description: 'Это описание страницы без ключевых слов',
      keywords: 'сайт, страница'
    },
    optimized: {
      content: `<h2>Великолепные возможности ${url}</h2>

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget felis eget urna malesuada maximus.

<h3>Наши преимущества</h3>

Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed at lorem ut nunc fermentum laoreet.

<h3>Инновационные решения</h3>

Praesent nec nisi sed metus sollicitudin tincidunt vel nec arcu. Nullam tincidunt, dolor at posuere elementum, neque felis volutpat felis, vitae elementum turpis sem quis risus.

<ul>
  <li>Высокое качество услуг: Мы предлагаем только лучшие решения для наших клиентов</li>
  <li>Инновационный подход: Используем современные технологии для достижения результатов</li>
  <li>Индивидуальные решения: Разрабатываем уникальные стратегии для каждого клиента</li>
  <li>Поддержка 24/7: Наша команда всегда готова помочь вам с любыми вопросами</li>
</ul>`,
      meta: {
        description: `${url} - ведущий сервис по предоставлению инновационных решений для бизнеса. Наша компания специализируется на разработке индивидуальных стратегий оптимизации и роста для клиентов по всему миру.`,
        keywords: 'оптимизация, инновации, качество, услуги, решения, поддержка, стратегия, бизнес, развитие, технологии'
      }
    }
  };
  
  return {
    beforeScore,
    afterScore,
    demoPage
  };
};
