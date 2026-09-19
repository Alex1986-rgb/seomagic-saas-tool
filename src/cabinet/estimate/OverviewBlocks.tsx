import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCabinetProject } from '../project';
import { rubShort } from '../format';
import { Blueprint, Kicker, MUTED, StepBars } from '../ui';
import { estimateStatusView, ORDER_STAGES, orderStageOf, useSavedEstimate } from './store';

/**
 * Блоки сметы и заказа для экрана «Обзор».
 *
 * Сумма и статус — из сохранённой сметы кабинета (job_estimates, метка cabinet-v2), той же, что
 * читают шапка и «Исправление»: три поверхности не должны показывать три разных числа.
 * Черновик классификатора сюда не попадает — это другой расчёт (см. store.ts).
 */

function useProjectSavedEstimate() {
  const { userId, projectAudits } = useCabinetProject();
  const ids = useMemo(() => projectAudits.map((a) => a.id), [projectAudits]);
  return useSavedEstimate(userId, ids);
}

/** Плитка «Смета на исправления» — стиль как Stat из ui.tsx. Нет сметы — «—» и ссылка собрать. */
export const EstimateStat: React.FC = () => {
  const { estimate, loading } = useProjectSavedEstimate();
  const view = estimate ? estimateStatusView(estimate.status) : null;
  return (
    <Blueprint style={{ padding: 'var(--space-4)', display: 'grid', gap: 'var(--space-2)', alignContent: 'start' }}>
      <Kicker>Смета на исправления</Kicker>
      <span style={{ fontFamily: 'var(--font-heading)', fontSize: 44, lineHeight: 1 }}>
        {loading ? '…' : estimate ? rubShort(estimate.total) : '—'}
      </span>
      {!loading &&
        (estimate && view ? (
          <Link to={view[2]} style={{ fontSize: 12 }}>
            {view[1]}
          </Link>
        ) : (
          <Link to="/app/estimate" style={{ fontSize: 12 }}>
            Собрать смету
          </Link>
        ))}
    </Blueprint>
  );
};

/** Полоса «Заказ · шаг N из 5». Заказ есть только у согласованной или оплаченной сметы. */
export const OrderStrip: React.FC = () => {
  const { estimate } = useProjectSavedEstimate();
  const stage = orderStageOf(estimate);
  if (!estimate || stage === 0) return null;
  const [label, note, cta] = ORDER_STAGES[stage - 1];
  return (
    <Blueprint style={{ padding: 'var(--space-6)', display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', alignItems: 'center' }}>
      <div style={{ flex: 1, minWidth: 220 }}>
        <div style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: MUTED, marginBottom: 6 }}>
          Заказ · шаг {stage} из 5
        </div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 24 }}>{label}</div>
        <div style={{ fontSize: 12.5, color: MUTED, marginTop: 2 }}>{note}</div>
      </div>
      <StepBars total={5} current={stage} />
      <Link to="/app/order" className="btn btn-primary" style={{ whiteSpace: 'nowrap', textDecoration: 'none' }}>
        {cta}
      </Link>
    </Blueprint>
  );
};
