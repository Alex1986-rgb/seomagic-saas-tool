
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
        <ol className="list-decimal pl-6 space-y-3">
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
          <li>
            <strong>Расшифровка списка ошибок:</strong>
            <div className="mt-2 border border-primary/20 p-3 rounded-md bg-primary/5">
              <h4 className="font-medium text-base mb-2">Ошибки разделены на три категории:</h4>
              <ul className="pl-4 space-y-2">
                <li>
                  <strong className="text-red-500">Критические ошибки</strong> - серьезно влияют на SEO и требуют немедленного исправления:
                  <ul className="list-disc pl-6 mt-1">
                    <li>Отсутствие HTTPS</li>
                    <li>Страницы с кодом 4xx/5xx</li>
                    <li>Битые ссылки</li>
                    <li>Отсутствие или дублирование тегов title/description</li>
                  </ul>
                </li>
                <li>
                  <strong className="text-amber-500">Важные улучшения</strong> - значительно повышают эффективность сайта:
                  <ul className="list-disc pl-6 mt-1">
                    <li>Проблемы со структурой заголовков</li>
                    <li>Отсутствие alt-текстов у изображений</li>
                    <li>Проблемы с индексацией</li>
                    <li>Слишком длинные/короткие мета-теги</li>
                  </ul>
                </li>
                <li>
                  <strong className="text-green-500">Возможности</strong> - рекомендации для дальнейшей оптимизации:
                  <ul className="list-disc pl-6 mt-1">
                    <li>Оптимизация скорости загрузки</li>
                    <li>Улучшение мобильной версии</li>
                    <li>Добавление структурированных данных</li>
                    <li>Оптимизация контента и ключевых слов</li>
                  </ul>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <strong>Смета на оптимизацию:</strong>
            <div className="mt-2 border border-primary/20 p-3 rounded-md bg-primary/5">
              <p className="mb-2">Система автоматически формирует смету на исправление найденных проблем. Стоимость рассчитывается на основе:</p>
              <ul className="list-disc pl-6">
                <li>Количества страниц на сайте</li>
                <li>Типа и сложности обнаруженных проблем</li>
                <li>Необходимости оптимизации контента</li>
                <li>Необходимости технических изменений</li>
              </ul>
              <p className="mt-2 text-sm">Смета включает подробную разбивку стоимости по категориям работ и рекомендациям.</p>
            </div>
          </li>
          <li>Используйте инструменты экспорта для сохранения отчета в форматах:
            <ul className="list-disc pl-6 mt-2">
              <li>PDF-отчет - подробный отчет с графиками и рекомендациями</li>
              <li>HTML-экспорт - интерактивная веб-страница с результатами</li>
              <li>JSON - структурированные данные для интеграции</li>
              <li>XML-карта сайта - для отправки в поисковые системы</li>
            </ul>
          </li>
        </ol>
        
        <div className="bg-secondary/10 p-4 rounded-md mt-4">
          <h4 className="font-medium mb-2">Запуск процесса оптимизации</h4>
          <p className="text-sm">После анализа результатов вы можете запустить автоматическую оптимизацию сайта, которая:</p>
          <ul className="list-disc pl-6 mt-2 text-sm">
            <li>Создаст оптимизированные версии страниц</li>
            <li>Исправит основные технические ошибки</li>
            <li>Улучшит контент с учетом SEO-рекомендаций</li>
            <li>Предоставит архив с оптимизированной версией сайта</li>
          </ul>
          <p className="text-sm mt-2 italic">Процесс оптимизации доступен после оплаты согласно сформированной смете.</p>
        </div>
      </div>
    </section>
  );
};

export default SeoAudit;
