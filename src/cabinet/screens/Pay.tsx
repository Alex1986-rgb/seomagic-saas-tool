import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageSeo } from '@/components/seo/PageSeo';
import { useCabinetTheme } from '../CabinetLayout';
import { useCabinetProject } from '../project';
import { dateLong, num, rub } from '../format';
import { Blueprint, Empty, ErrorNote, Loading, MUTED, Seg, Tag } from '../ui';
import { InvoiceRequest } from '../estimate/InvoiceRequest';
import { useSavedEstimate } from '../estimate/store';

/**
 * «Оплата» — без оболочки кабинета (макет, строки 2589–2641): на оплате ничего не должно отвлекать.
 *
 * Сумма — из согласованной сметы (job_estimates), той же, что в шапке и на «Исправлении».
 * Приёма оплаты нет: ни QR СБП, ни карты, ни холда. Кнопка «Я оплатил — продолжить» из макета
 * имитировала бы платёж — вместо неё честное «не подключено» и заявка на счёт (contact_requests).
 */

type Method = 'sbp' | 'card' | 'invoice';
const METHOD_LABEL: Record<Method, string> = { sbp: 'СБП', card: 'Карта', invoice: 'Счёт для юрлица' };

const Pay: React.FC = () => {
  useCabinetTheme();
  const { userId, projectAudits, host, loading: projectLoading, error: projectError } = useCabinetProject();
  const ids = useMemo(() => projectAudits.map((a) => a.id), [projectAudits]);
  const { estimate, loading, error } = useSavedEstimate(userId, ids);
  const [method, setMethod] = useState<Method>('invoice');

  const agreed = estimate && (estimate.status === 'accepted' || estimate.status === 'paid');

  return (
    <div style={{ background: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-body)', minHeight: '100vh' }}>
      <PageSeo title="Оплата — SeoMarket" description="Оплата заказа на исправление сайта" noindex />
      <div
        data-screen
        style={{ maxWidth: 880, margin: '0 auto', padding: 'var(--space-8) var(--space-6) 64px', display: 'grid', gap: 'var(--space-8)' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-4)',
            flexWrap: 'wrap',
            borderBottom: '1px solid var(--color-divider)',
            paddingBottom: 'var(--space-4)',
          }}
        >
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 19, letterSpacing: '.04em' }}>SEOMARKET</span>
          <span style={{ flex: 1 }} />
          <Link to="/app/order" style={{ fontSize: 13 }}>
            ← Вернуться к заказу
          </Link>
        </div>

        {projectLoading || loading ? (
          <Loading />
        ) : projectError || error ? (
          <ErrorNote>{projectError || error}</ErrorNote>
        ) : !estimate || !agreed ? (
          <Empty title="Оплачивать пока нечего" action={<Link to="/app/estimate">Открыть смету</Link>}>
            Оплата идёт по согласованной смете: сначала отметьте работы и согласуйте сумму.
          </Empty>
        ) : (
          <>
            <div>
              {/* Номера счёта в базе нет — показываем дату сметы, а не выдуманный INV-0418. */}
              <Tag>Смета от {dateLong(estimate.updatedAt ?? estimate.createdAt, false)}</Tag>
              <h1 style={{ fontSize: 34, margin: 'var(--space-3) 0 4px' }}>Оплата заказа</h1>
              <p style={{ fontSize: 14, color: MUTED, margin: 0 }}>
                {host} · {num(estimate.units)} правок
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 'var(--space-8)', alignItems: 'start' }}>
              <Blueprint style={{ padding: 'var(--space-6)', display: 'grid', gap: 'var(--space-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)', fontSize: 14 }}>
                  <span>Сумма работ</span>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 16, whiteSpace: 'nowrap' }}>{rub(estimate.gross)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)', fontSize: 14, color: 'var(--color-accent-700)' }}>
                  <span>Скидка · {Math.round(estimate.pct * 100)}%</span>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 16, whiteSpace: 'nowrap' }}>−{rub(estimate.discount)}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    borderTop: '1px solid var(--color-divider)',
                    paddingTop: 'var(--space-3)',
                  }}
                >
                  <span style={{ fontSize: 14 }}>К оплате</span>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: 36 }}>{rub(estimate.total)}</span>
                </div>
                {/* Холд — правило продукта, но механизма пока нет: говорим, как будет, и что сейчас его нет. */}
                <div style={{ border: '1px solid var(--color-accent)', padding: 'var(--space-3)', display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" style={{ flex: 'none', marginTop: 2 }}>
                    <rect x="4" y="10" width="16" height="10" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                  <span style={{ fontSize: 12.5, lineHeight: 1.5 }}>
                    По правилам сервиса сумма замораживается и списывается после одобрения исправленной копии. Холд пока не
                    подключён — до его запуска работаем по счёту.
                  </span>
                </div>
              </Blueprint>

              <div style={{ display: 'grid', gap: 'var(--space-4)', minWidth: 0 }}>
                {estimate.status === 'paid' ? (
                  <Empty title="Смета оплачена" action={<Link to="/app/order">Смотреть заказ</Link>}>
                    Оплата получена. Ход работ — на экране «Исправление».
                  </Empty>
                ) : (
                  <>
                    <div className="field" style={{ margin: 0 }}>
                      <label>Способ оплаты</label>
                      <Seg
                        name="pay-method"
                        value={method}
                        onChange={setMethod}
                        options={(['sbp', 'card', 'invoice'] as Method[]).map((m) => ({ value: m, label: METHOD_LABEL[m] }))}
                      />
                    </div>
                    <InvoiceRequest
                      host={host ?? ''}
                      amount={estimate.total}
                      units={estimate.units}
                      estimateId={estimate.id}
                      method={METHOD_LABEL[method]}
                    />
                    <p style={{ fontSize: 12, color: MUTED, margin: 0, textAlign: 'center' }}>
                      Для юрлиц — счёт по реквизитам. Закрывающие документы в кабинете пока не формируются.
                    </p>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Pay;
