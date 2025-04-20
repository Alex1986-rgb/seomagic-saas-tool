
import React from 'react';

const ProjectStructure: React.FC = () => {
  return (
    <section>
      <h3 className="text-xl font-semibold mb-4">Структура проекта</h3>
      
      <p className="mb-4">
        Проект SeoMarket организован по следующей структуре:
      </p>
      
      <div className="bg-muted p-4 rounded-md overflow-auto mb-4">
        <pre className="text-sm">
          {`
/src
  /components      # Компоненты React
    /audit         # Компоненты для SEO аудита
    /ui            # UI компоненты (shadcn/ui)
    /documentation # Компоненты документации
  /hooks           # Пользовательские хуки
  /pages           # Компоненты страниц
  /services        # Сервисы и API интеграции
    /audit         # Сервисы для SEO аудита
      /optimization # Модули оптимизации сайта
      /scanner      # Модули сканирования сайта
  /types           # TypeScript типы
  /utils           # Вспомогательные функции
  /lib             # Библиотеки и конфигурации
          `}
        </pre>
      </div>
      
      <h4 className="text-lg font-medium mb-2">Ключевые компоненты:</h4>
      
      <ul className="list-disc pl-6 space-y-2 mb-4">
        <li><strong>AuditResultsContainer</strong> - Основной контейнер для отображения результатов аудита, управляет загрузкой и отображением данных</li>
        <li><strong>SeoAuditResults</strong> - Обертка для результатов аудита с обработкой ошибок и таймаутов</li>
        <li><strong>AuditMain</strong> - Отображает общие результаты аудита, включая оценку и рекомендации</li>
        <li><strong>AuditOptimization</strong> - Отвечает за модуль оптимизации сайта и ценовое предложение</li>
        <li><strong>PageAnalysisTable</strong> - Таблица с анализом отдельных страниц сайта</li>
      </ul>
      
      <h4 className="text-lg font-medium mb-2">Сервисы оптимизации:</h4>
      
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>optimizationCalculator</strong> - Калькулятор стоимости оптимизации на основе обнаруженных проблем</li>
        <li><strong>contentAnalyzer</strong> - Анализ содержимого страниц для выявления SEO-проблем</li>
        <li><strong>siteAnalysis</strong> - Анализ структуры сайта, дубликатов и битых ссылок</li>
        <li><strong>useAuditData</strong> - Хук для работы с данными аудита, включая загрузку и обработку</li>
      </ul>
    </section>
  );
};

export default ProjectStructure;
