
import React from 'react';

const SeoAudit: React.FC = () => {
  return (
    <section>
      <h3 className="text-xl font-semibold flex items-center">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary mr-2">2</span>
        Запуск SEO аудита
      </h3>
      <div className="ml-8 mt-4 space-y-4">
        <p>Для проведения SEO аудита вашего сайта:</p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>На главной странице или в разделе «Аудит» введите URL вашего сайта в поле ввода.</li>
          <li>Нажмите кнопку «Начать аудит».</li>
          <li>Система начнет сканирование вашего сайта. Это может занять некоторое время в зависимости от размера сайта.</li>
          <li>После завершения сканирования вы увидите подробный отчет о SEO-состоянии вашего сайта.</li>
        </ol>
      </div>
    </section>
  );
};

export default SeoAudit;
