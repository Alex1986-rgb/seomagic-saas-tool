
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
    /audit         # Компоненты для SEO аудита (AuditMain.tsx, IssuesSummary.tsx, AuditOptimization.tsx и др.)
      /results     # Основные контейнеры и результаты (AuditResultsContainer, AuditIssuesAndEstimate и т.д.)
    /ui            # UI компоненты (shadcn/ui)
    /documentation # Компоненты документации (sections/ProjectStructure.tsx и др.)
  /hooks           # Пользовательские хуки
  /pages           # Компоненты страниц (вкл. страницу /audit)
  /services        # Сервисы и API интеграции
    /audit         # Сервисы для SEO аудита, расчёта сметы/ошибок
      /optimization      # Модули оптимизации сайта (optimizationCalculator.ts — генерация смет, расчёт проблем)
      /scanner           # Модули сканирования сайта
  /types           # TypeScript типы (audit.ts: AuditData, RecommendationData, Issues, OptimizationItems и др.)
  /utils           # Вспомогательные функции
  /lib             # Библиотеки и конфигурации
          `}
        </pre>
      </div>
      <h4 className="text-lg font-medium mb-2">Ключевые компоненты:</h4>
      <ul className="list-disc pl-6 space-y-2 mb-4">
        <li><strong>AuditResultsContainer</strong> - Главный контейнер вывода результатов аудита, обработки загрузки, ошибок, сметы и списка проблем</li>
        <li><strong>AuditMain</strong> - Сводка общего результата аудита + рекомендации</li>
        <li><strong>AuditOptimization</strong> - Модуль расчёта сметы (стоимости) оптимизации<br/><span className="text-xs text-muted-foreground">Данные берутся из <code>optimizationCalculator</code> (см. /services/audit/optimization/optimizationCalculator.ts)</span></li>
        <li><strong>IssuesSummary</strong> - Компонент показа количества ошибок (критичные, важные, возможности)</li>
        <li><strong>AuditIssuesAndEstimate</strong> - <em>Компонент для вывода списка обнаруженных ошибок и итоговой сметы</em></li>
      </ul>
      <h4 className="text-lg font-medium mb-2">Структура основных данных аудита:</h4>
      <div className="bg-muted p-3 rounded mb-4 text-sm">
        <pre>
{`/**
 * Тип issues:
 *   - critical: string[]    // Критические ошибки (SEO-угроза)
 *   - important: string[]   // Важные проблемы
 *   - opportunities: string[] // Возможности/рекомендации
 * 
 * Тип optimizationItems:
 *   - name: string        // Название работы
 *   - description: string // Подробности выполнения
 *   - count: number       // Кол-во объектов (например, страниц)
 *   - price: number       // Базовая цена за единицу
 *   - totalPrice: number  // Общая стоимость (price * count)
 *
 * Блок AuditIssuesAndEstimate:
 *   - auditData: AuditData       // Данные аудита с issues (ошибками)
 *   - optimizationCost: number   // Итоговая стоимость оптимизации
 *   - optimizationItems: array   // Детализация работ по оптимизации
 *
 * @see src/types/audit.ts для полного описания
 */
`}
        </pre>
      </div>
      <h4 className="text-lg font-medium mb-2">Сервисы ошибок и сметы:</h4>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>optimizationCalculator</strong> - Калькулятор сметы и сбор всех ошибок/рекомендаций (вызывается после аудита)</li>
        <li><strong>contentAnalyzer</strong> - Анализ контента для поиска SEO-проблем</li>
        <li><strong>siteAnalysis</strong> - Анализ структуры сайта, битых ссылок и дубликатов</li>
        <li><strong>useAuditData</strong> - Хук для доступа к данным аудита, ошибкам, смете и загрузке данных</li>
      </ul>
      <div className="mt-4 text-sm text-muted-foreground">
        <strong>Комментарии по структуре ошибок и сметы:</strong> <br/>
        <ul className="list-disc pl-6">
          <li><strong>Ошибки (issues):</strong> 
            <ul className="list-disc pl-6">
              <li>critical — Критические ошибки (сильно влияют на SEO)</li>
              <li>important — Важные проблемы (рекомендуется устранить)</li>
              <li>opportunities — Возможности дальнейшей оптимизации</li>
            </ul>
          </li>
          <li><strong>Смета (optimizationCost, optimizationItems):</strong> 
            <ul className="list-disc pl-6">
              <li>optimizationCost — Итоговая стоимость устранения ошибок/оптимизации</li>
              <li>optimizationItems — Массив детализированных работ ("тип работы", "кол-во", "стоимость")</li>
            </ul>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default ProjectStructure;
