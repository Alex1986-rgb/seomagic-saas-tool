
import React from 'react';

const ReportAnalysis: React.FC = () => {
  return (
    <section>
      <h3 className="text-xl font-semibold flex items-center">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary mr-2">3</span>
        Анализ отчета
      </h3>
      <div className="ml-8 mt-4 space-y-4">
        <p>Отчет о SEO аудите содержит следующие разделы:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Общий SEO-скор</strong> — оценка общего состояния сайта с точки зрения SEO.</li>
          <li><strong>Технические проблемы</strong> — список технических ошибок, влияющих на SEO.</li>
          <li><strong>Проблемы контента</strong> — анализ текстового содержания страниц.</li>
          <li><strong>Структура сайта</strong> — информация о структуре и навигации сайта.</li>
          <li><strong>Внутренняя оптимизация</strong> — анализ мета-тегов, заголовков и других элементов.</li>
          <li><strong>Рекомендации</strong> — конкретные рекомендации по улучшению SEO.</li>
        </ul>
      </div>
    </section>
  );
};

export default ReportAnalysis;
