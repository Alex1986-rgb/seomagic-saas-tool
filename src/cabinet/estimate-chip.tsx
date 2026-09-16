import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCabinetProject } from './project';
import { rubShort } from './format';
import { estimateStatusView, useSavedEstimate } from './estimate/store';

/**
 * Чип сметы в шапке кабинета («Смета 48 т₽ · согласована»).
 *
 * Сумма и статус — из сохранённой сметы кабинета (та же запись, что у плитки Обзора и экрана
 * «Исправление»). Пока смета не согласована и не отправлена, в шапке ничего нет: выдуманная или
 * промежуточная сумма в шапке расходилась бы с экраном «Смета».
 */
export const EstimateChip: React.FC = () => {
  const { userId, projectAudits } = useCabinetProject();
  const ids = useMemo(() => projectAudits.map((a) => a.id), [projectAudits]);
  const { estimate } = useSavedEstimate(userId, ids);
  if (!estimate) return null;
  const [status, , to] = estimateStatusView(estimate.status);
  // Точка акцентная, когда клиент уже сказал «да» (согласована или оплачена).
  const agreed = estimate.status === 'accepted' || estimate.status === 'paid';
  return (
    <Link
      to={to}
      data-hide-mobile
      data-hover-accent
      style={{
        fontSize: 12,
        border: '1px solid var(--color-divider)',
        padding: '4px 10px',
        textDecoration: 'none',
        color: 'inherit',
        whiteSpace: 'nowrap',
        display: 'inline-flex',
        gap: 6,
        alignItems: 'center',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          background: agreed ? 'var(--color-accent)' : 'color-mix(in srgb,var(--color-text) 30%,transparent)',
        }}
      />
      Смета {rubShort(estimate.total)} · {status}
    </Link>
  );
};
