
import React from 'react';

const SeoAudit: React.FC = () => {
  return (
    <section>
      <h3 className="text-xl font-semibold flex items-center">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary mr-2">2</span>
        SEO аудит сайта
      </h3>
      <div className="ml-8 mt-4 space-y-4">
        <p>Для проведения комплексного SEO аудита:</p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Введите URL сайта в поле на главной странице.</li>
          <li>Выберите тип анализа:
            <ul className="list-disc pl-6 mt-2">
              <li><strong>Базовый аудит:</strong> Быстрая проверка основных SEO параметров</li>
              <li><strong>Глубокий анализ:</strong> Детальное сканирование всех страниц</li>
            </ul>
          </li>
          <li>После завершения сканирования вы получите:
            <ul className="list-disc pl-6 mt-2">
              <li>Общий SEO-скор сайта</li>
              <li>Список технических ошибок</li>
              <li>Анализ контента</li>
              <li>Рекомендации по оптимизации</li>
              <li>Смету на исправление ошибок</li>
            </ul>
          </li>
          <li>Используйте инструменты экспорта для сохранения отчета в PDF/HTML.</li>
        </ol>
      </div>
    </section>
  );
};

export default SeoAudit;
