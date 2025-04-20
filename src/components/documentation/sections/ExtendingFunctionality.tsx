
import React from 'react';

const ExtendingFunctionality: React.FC = () => {
  return (
    <section>
      <h3 className="text-xl font-semibold mb-4">Расширение функциональности</h3>
      
      <p className="mb-4">
        SeoMarket разработан с учетом модульности и расширяемости. Вот руководство по добавлению новых функций и интеграций.
      </p>
      
      <div className="space-y-6">
        <div>
          <h4 className="text-lg font-medium mb-2">Добавление новых метрик аудита</h4>
          <p className="text-sm mb-2">
            Для добавления новых метрик SEO аудита:
          </p>
          <ol className="list-decimal pl-6 space-y-2 mb-2">
            <li>Добавьте новый тип метрики в <code>src/types/audit.ts</code></li>
            <li>Создайте модуль анализа в <code>src/services/audit/</code></li>
            <li>Интегрируйте в основной процесс аудита в <code>useAuditCore.ts</code></li>
            <li>Добавьте визуализацию в компоненты результатов аудита</li>
          </ol>
          <p className="text-sm italic">
            Пример: Добавление анализа скорости загрузки страницы или мобильной совместимости.
          </p>
        </div>
        
        <div>
          <h4 className="text-lg font-medium mb-2">Интеграция внешних API</h4>
          <p className="text-sm mb-2">
            Для интеграции нового внешнего API (например, Google PageSpeed Insights):
          </p>
          <ol className="list-decimal pl-6 space-y-2 mb-2">
            <li>Создайте новый сервис в <code>src/services/</code> для работы с API</li>
            <li>Добавьте необходимые типы данных в <code>src/types/</code></li>
            <li>Создайте хук для использования сервиса в компонентах</li>
            <li>Обновите модуль аудита для использования новых данных</li>
          </ol>
        </div>
        
        <div>
          <h4 className="text-lg font-medium mb-2">Создание новых инструментов оптимизации</h4>
          <p className="text-sm mb-3">
            Для добавления нового инструмента оптимизации:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-3">
            <li>Создайте новый модуль оптимизации в <code>src/services/audit/optimization/</code></li>
            <li>Добавьте соответствующие элементы UI в <code>src/components/audit/results/components/optimization/</code></li>
            <li>Интегрируйте в существующий поток процесса оптимизации</li>
            <li>Добавьте расчет стоимости в <code>optimizationCalculator.ts</code></li>
          </ul>
          <div className="bg-primary/10 p-3 rounded-md">
            <p className="text-sm font-medium mb-1">Важное примечание:</p>
            <p className="text-sm">
              При добавлении новых инструментов оптимизации обязательно обновите таблицу стоимости с подробным описанием услуг и их ценообразования. Цены должны быть согласованы с общей моделью ценообразования приложения.
            </p>
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-medium mb-2">Локализация и интернационализация</h4>
          <p className="text-sm mb-2">
            SeoMarket подготовлен для мультиязычной поддержки. Для добавления нового языка:
          </p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Добавьте новый файл перевода в <code>src/locales/</code></li>
            <li>Обновите селектор языка в настройках приложения</li>
            <li>Убедитесь, что все строки пользовательского интерфейса используют функцию перевода</li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default ExtendingFunctionality;
