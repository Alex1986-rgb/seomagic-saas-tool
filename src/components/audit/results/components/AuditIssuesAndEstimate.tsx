
import React from 'react';
import { AuditData } from '@/types/audit';
import { OptimizationItem } from './optimization/CostDetailsTable';

/**
 * Блок для вывода списка ошибок и сметы после аудита сайта.
 * Для разработчиков: используйте этот компонент после окончания аудита для вывода ключевых проблем и стоимости оптимизации.
 * @param auditData {AuditData} — структура данных по найденным ошибкам
 * @param optimizationCost {number} — финальная стоимость оптимизации
 * @param optimizationItems {OptimizationItem[]} — детализация работ
 */
interface AuditIssuesAndEstimateProps {
  auditData: AuditData;
  optimizationCost?: number;
  optimizationItems?: OptimizationItem[];
}

const AuditIssuesAndEstimate: React.FC<AuditIssuesAndEstimateProps> = ({
  auditData,
  optimizationCost,
  optimizationItems = [],
}) => {
  // Выводим блоки ошибок только если есть найденные проблемы
  const { issues } = auditData;

  const hasErrors =
    issues.critical.length > 0 || issues.important.length > 0 || issues.opportunities.length > 0;

  return (
    <div className="neo-card p-6 mt-8">
      <h2 className="text-xl font-bold mb-4">Детализация ошибок и смета оптимизации</h2>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Список ошибок</h3>
        {hasErrors ? (
          <ul className="list-disc pl-6 space-y-1">
            {issues.critical.length > 0 && (
              <>
                <li className="text-red-600 font-medium">Критические ошибки:
                  <ul className="list-disc pl-5">
                    {issues.critical.map((err, idx) => (
                      <li key={`c_${idx}`}>{err}</li>
                    ))}
                  </ul>
                </li>
              </>
            )}
            {issues.important.length > 0 && (
              <>
                <li className="text-amber-700 font-medium">Важные проблемы:
                  <ul className="list-disc pl-5">
                    {issues.important.map((err, idx) => (
                      <li key={`i_${idx}`}>{err}</li>
                    ))}
                  </ul>
                </li>
              </>
            )}
            {issues.opportunities.length > 0 && (
              <>
                <li className="text-green-700 font-medium">Возможности для улучшения:
                  <ul className="list-disc pl-5">
                    {issues.opportunities.map((hint, idx) => (
                      <li key={`o_${idx}`}>{hint}</li>
                    ))}
                  </ul>
                </li>
              </>
            )}
          </ul>
        ) : (
          <div className="text-green-600">Ошибки не найдены — сайт соответствует базовым требованиям SEO.</div>
        )}
      </div>
      {typeof optimizationCost === "number" && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Смета на устранение ошибок</h3>
          <div className="mb-2">Итоговая стоимость оптимизации: <span className="font-bold text-primary">{optimizationCost} ₽</span></div>
          {optimizationItems && optimizationItems.length > 0 && (
            <table className="w-full mb-3 text-sm border rounded">
              <thead>
                <tr className="bg-primary/10">
                  <th className="py-1 px-2 text-left">Работа</th>
                  <th className="py-1 px-2 text-left">Кол-во</th>
                  <th className="py-1 px-2 text-left">Стоимость (₽)</th>
                </tr>
              </thead>
              <tbody>
                {optimizationItems.map((item, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-1 px-2">{item.name || item.type}</td>
                    <td className="py-1 px-2">{item.count || item.quantity || 1}</td>
                    <td className="py-1 px-2">{item.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="text-xs text-muted-foreground">* Стоимость может отличаться в зависимости от индивидуальных требований</div>
        </div>
      )}
    </div>
  );
};

export default AuditIssuesAndEstimate;
