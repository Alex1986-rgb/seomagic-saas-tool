import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCabinetProject } from '../project';
import { dateLong, dateShort, num, rub } from '../format';
import { Blueprint, Empty, ErrorNote, Loading, MONO, MUTED, NotConnected, Screen, Tag } from '../ui';
import { InvoiceRequest } from '../estimate/InvoiceRequest';
import { ORDER_STAGES, ORDER_STEP_NAMES, orderStageOf, useSavedEstimate, type SavedEstimate } from '../estimate/store';
import { JOB_STATUS_LABEL, useOptimization } from '../estimate/optimization';

/**
 * «Исправление сайта» — пять стадий заказа (макет, строки 957–1335; ORDER_STAGE / WORK_STEPS).
 *
 * Заказ = согласованная смета (job_estimates). Стадия выводится из её статуса (store.ts →
 * orderStageOf), а не хранится отдельно и не двигается таймером, как в прототипе.
 *
 * Что есть на самом деле:
 *  1. Оплата — сумма из сметы; приёма оплаты нет → «не подключено» и заявка на счёт.
 *  2. Правки — прогресс настоящего задания optimization_jobs и страницы fixed_pages. Нет задания —
 *     пусто, без имитации.
 *  3–5. Превью копии на поддомене, доставка (SSH-ключ, архив, доступы), установка, откат, акт —
 *     бэкенда нет. Стадии свёрстаны и кликабельны, но честно говорят, чего не хватает.
 */

const Order: React.FC = () => {
  const cab = useCabinetProject();
  const ids = useMemo(() => cab.projectAudits.map((a) => a.id), [cab.projectAudits]);
  const { estimate, loading, error } = useSavedEstimate(cab.userId, ids);
  const stage = orderStageOf(estimate);
  const [view, setView] = useState<number>(1);

  // Открываем текущую стадию заказа; дальше пользователь листает шаги сам.
  useEffect(() => {
    if (stage > 0) setView(stage);
  }, [stage]);

  if (cab.loading || loading) return <Screen maxWidth={1100}><Loading /></Screen>;
  if (cab.error || error) return <Screen maxWidth={1100}><ErrorNote>{cab.error || error}</ErrorNote></Screen>;

  if (!estimate || stage === 0) {
    return (
      <Screen maxWidth={1100}>
        <div>
          <h1 style={{ fontSize: 36, margin: '0 0 4px' }}>Исправление сайта</h1>
          <p style={{ fontSize: 14, color: MUTED, margin: 0 }}>{cab.host ?? 'Проекта пока нет'}</p>
        </div>
        <Empty title="Заказа пока нет" action={<Link to={cab.project ? '/app/estimate' : '/app/audit'}>{cab.project ? 'Открыть смету' : 'Запустить аудит'}</Link>}>
          Заказ появляется, когда смета согласована: вы отмечаете нужные правки, фиксируете сумму — и дальше идут оплата,
          правки, превью, доставка и результат.
        </Empty>
      </Screen>
    );
  }

  const auditOfEstimate = cab.projectAudits.find((a) => a.id === estimate.auditId) ?? null;

  return (
    <Screen maxWidth={1100}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          {/* Номеров заказов в базе нет — вместо «Заказ №418» стадия из статуса сметы. */}
          <Tag>{ORDER_STAGES[stage - 1][0]}</Tag>
          <h1 style={{ fontSize: 36, margin: 'var(--space-2) 0 4px' }}>Исправление сайта</h1>
          <p style={{ fontSize: 14, color: MUTED, margin: 0 }}>
            {cab.host} · {num(estimate.units)} правок по смете от {dateLong(estimate.updatedAt ?? estimate.createdAt, false)}
          </p>
        </div>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 28, whiteSpace: 'nowrap' }}>{rub(estimate.total)}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 'var(--space-3)' }}>
        {ORDER_STEP_NAMES.map((name, i) => {
          const n = i + 1;
          return (
            <button
              key={name}
              type="button"
              onClick={() => setView(n)}
              aria-pressed={view === n}
              style={{
                textAlign: 'left',
                background: 'transparent',
                color: 'inherit',
                font: 'inherit',
                cursor: 'pointer',
                padding: 'var(--space-3)',
                transition: 'border-color .15s ease',
                border: `1px solid ${view === n ? 'var(--color-accent)' : 'var(--color-divider)'}`,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: '.08em',
                  textTransform: 'uppercase',
                  color: n <= stage ? 'var(--color-accent)' : MUTED,
                  marginBottom: 6,
                }}
              >
                Шаг {n}
                {n === stage ? ' · сейчас' : n < stage ? ' · пройден' : ''}
              </div>
              <div style={{ fontSize: 14 }}>{name}</div>
            </button>
          );
        })}
      </div>

      {view === 1 && <StepPay estimate={estimate} host={cab.host ?? ''} />}
      {view === 2 && <StepWork userId={cab.userId} estimate={estimate} stage={stage} />}
      {view === 3 && (
        <NotConnected
          title="Превью исправленной копии не подключено"
          needs={[
            'Копия сайта с внесёнными правками на поддомене, закрытая noindex, robots.txt и паролем',
            'Повторный аудит копии по тем же проверкам — балл копии, а не прогноз',
            'Сравнение «ваш сайт / копия» по страницам и разделам',
            'Одобрение или возврат на доработку со списанием из холда',
          ]}
        >
          Когда появится, здесь будет адрес копии, доступ к ней и построчное сравнение. Сейчас правки существуют только
          рекомендациями на экране <Link to="/app/optimize">«Оптимизация»</Link>
          {auditOfEstimate?.seoScore != null ? `; балл аудита, от которого считалась смета, — ${Math.round(auditOfEstimate.seoScore)}` : ''}.
        </NotConnected>
      )}
      {view === 4 && (
        <NotConnected
          title="Доставка исправлений не подключена"
          needs={[
            'Установка по нашему SSH-ключу с журналом действий',
            'ZIP-архив изменённых файлов с инструкцией',
            'Одноразовая передача доступов к хостингу',
            'Полная копия сайта и базы перед установкой и откат',
          ]}
        >
          Способ доставки выбирается после одобрения превью. Ни ключа, ни архива сейчас нет — показывать их было бы обещанием,
          которое никто не выполнит.
        </NotConnected>
      )}
      {view === 5 && (
        <div style={{ display: 'grid', gap: 'var(--space-8)' }}>
          <NotConnected
            title="Итог установки не подключён"
            needs={[
              'Дата установки и откат в течение 30 дней',
              'Позиции до и после установки по запросам проекта',
              'Отправка изменённых адресов на переобход в Яндекс Вебмастер и Search Console',
              'Акт, счёт и перечень правок — закрывающие документы',
            ]}
          />
          <section style={{ border: '1px solid var(--color-divider)', padding: 'var(--space-6)' }}>
            <h2 style={{ fontSize: 18, margin: '0 0 var(--space-3)' }}>Что дальше</h2>
            <p style={{ fontSize: 13.5, color: MUTED, margin: '0 0 var(--space-4)', maxWidth: '64ch' }}>
              Повторный аудит — бесплатно. Он покажет, какие замечания закрыты, и найдёт новые.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              <Link to="/app/positions" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                Смотреть позиции
              </Link>
              <Link to="/app/audit" className="btn btn-ghost" style={{ textDecoration: 'none' }}>
                Запустить аудит сейчас
              </Link>
            </div>
          </section>
        </div>
      )}
    </Screen>
  );
};

/** Шаг 1. Сумма из сметы; оплаты нет — заявка на счёт. */
const StepPay: React.FC<{ estimate: SavedEstimate; host: string }> = ({ estimate, host }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 'var(--space-8)', alignItems: 'start' }}>
    <Blueprint style={{ padding: 'var(--space-6)', display: 'grid', gap: 'var(--space-4)' }}>
      <h2 style={{ fontSize: 20, margin: 0 }}>К оплате</h2>
      <Line label="Правок по смете" value={num(estimate.units)} />
      <Line label="Сумма работ" value={rub(estimate.gross)} />
      <Line label={`Скидка за объём · ${Math.round(estimate.pct * 100)}%`} value={`−${rub(estimate.discount)}`} accent />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid var(--color-divider)', paddingTop: 'var(--space-3)' }}>
        <span style={{ fontSize: 14 }}>Итого</span>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 34 }}>{rub(estimate.total)}</span>
      </div>
      {estimate.status === 'paid' ? (
        <div style={{ border: '1px solid var(--color-accent)', padding: 'var(--space-3)', fontSize: 13 }}>Оплата получена.</div>
      ) : (
        <>
          <InvoiceRequest host={host} amount={estimate.total} units={estimate.units} estimateId={estimate.id} compact />
          <Link to="/app/pay" style={{ fontSize: 12.5, textAlign: 'center' }}>
            Страница оплаты
          </Link>
        </>
      )}
    </Blueprint>

    <div style={{ display: 'grid', gap: 'var(--space-6)', minWidth: 0 }}>
      {estimate.status !== 'paid' && (
        <NotConnected title="Приём оплаты не подключён">
          Оплата по СБП и карте и холд до одобрения превью пока не работают. Счёт выставим по заявке, оплату отметит
          администратор — после этого заказ перейдёт к правкам.
        </NotConnected>
      )}
      {/* Выбор «статическая копия / патч для CMS» в макете — форма без бэкенда: сохранить выбор некуда,
          а подсказка «у вас Битрикс, 3 412 страниц» выдумана. Оставляем описание способов. */}
      <section style={{ border: '1px solid var(--color-divider)', padding: 'var(--space-6)' }}>
        <h2 style={{ fontSize: 18, margin: '0 0 var(--space-3)' }}>Как будем править</h2>
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <div>
            <span style={{ display: 'block', fontSize: 14 }}>Статическая копия</span>
            <span style={{ display: 'block', fontSize: 12.5, color: MUTED }}>
              Весь сайт выгружается в HTML и правится целиком. Подходит лендингам, визиткам и блогам — корзина и фильтры в
              копии работать не будут.
            </span>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: 14 }}>Патч для CMS</span>
            <span style={{ display: 'block', fontSize: 12.5, color: MUTED }}>
              Правятся только мета-теги, alt, canonical, тексты и изображения. Магазин остаётся живым.
            </span>
          </div>
        </div>
        <p style={{ fontSize: 12.5, color: MUTED, margin: 'var(--space-4) 0 0' }}>Способ согласуем при выставлении счёта.</p>
      </section>

      <Blueprint as="section" style={{ padding: 'var(--space-6)' }}>
        <h2 style={{ fontSize: 18, margin: '0 0 var(--space-2)' }}>Сомневаетесь — посмотрите на своих страницах</h2>
        <p style={{ fontSize: 13.5, lineHeight: 1.55, color: MUTED, margin: '0 0 var(--space-4)', maxWidth: '52ch' }}>
          Запустите оптимизацию: нейросеть разберёт страницы сайта и предложит title, description и структуру заголовков.
          Это бесплатно в пределах суточного лимита.
        </p>
        <Link to="/app/optimize" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
          Открыть оптимизацию
        </Link>
      </Blueprint>
    </div>
  </div>
);

/** Шаг 2. Прогресс — только по настоящему заданию optimization_jobs. */
const StepWork: React.FC<{ userId: string | null; estimate: SavedEstimate; stage: number }> = ({ userId, estimate, stage }) => {
  const opt = useOptimization(userId, estimate.auditId);
  if (stage < 2) {
    // Бесплатный пробный запуск оптимизации — не работа по заказу: до оплаты прогресс не показываем,
    // иначе неоплаченный заказ выглядел бы как «правки в работе».
    return (
      <Empty title="Правки начнутся после оплаты" action={<Link to="/app/optimize">Оптимизация</Link>}>
        Здесь появится ход настоящего задания: сколько страниц обработано, какие готовы и где ошибки.
      </Empty>
    );
  }
  if (opt.loading) return <Loading />;
  if (opt.error) return <ErrorNote>{opt.error}</ErrorNote>;
  // Работа по заказу — задание, созданное после оплаты (последнего изменения сметы).
  const since = estimate.updatedAt ? new Date(estimate.updatedAt).getTime() : 0;
  const job = opt.jobs.find((j) => (j.createdAt ? new Date(j.createdAt).getTime() : 0) >= since) ?? null;
  if (!job) {
    return (
      <Empty title="Задание на правки ещё не создано">
        Оплата получена. Как только задание будет запущено, здесь появится его ход: сколько страниц обработано, какие готовы и
        где ошибки.
      </Empty>
    );
  }
  const pct = job.total > 0 ? Math.round((job.processed / job.total) * 100) : job.status === 'completed' ? 100 : 0;
  const active = job.status === 'queued' || job.status === 'processing';
  const done = !active;
  // Этапы — те, что реально проходит задание обработчика, в порядке статусов.
  const steps: [string, string, 'ожидает' | 'в работе' | 'готово'][] = [
    ['Задание в очереди', 'optimization-start принял запуск и проверил лимиты', 'готово'],
    [
      'Разбор страниц нейросетью',
      'title, description, текст и заголовки по содержимому страницы',
      job.status === 'queued' ? 'ожидает' : job.status === 'processing' ? 'в работе' : 'готово',
    ],
    ['Сохранение результатов', 'каждая страница пишется отдельно — обрыв не теряет сделанное', done ? 'готово' : job.processed > 0 ? 'в работе' : 'ожидает'],
  ];
  // Страницы этого задания — готовые после его запуска (пробные запуски до оплаты не считаем).
  const jobStart = job.createdAt ? new Date(job.createdAt).getTime() : since;
  const jobPages = opt.pages.filter((p) => (p.createdAt ? new Date(p.createdAt).getTime() : 0) >= jobStart);
  const log = [
    ...job.failures.map((f) => `ошибка: ${f.url} — ${f.error}`),
    ...jobPages.slice(0, 20).map((p) => `${dateShort(p.createdAt)} · готово: ${p.url}${p.model ? ` · ${p.model}` : ''}`),
  ];

  return (
    <Blueprint style={{ padding: 'var(--space-8)', display: 'grid', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        {active && <span data-blink style={{ width: 7, height: 7, flex: 'none', background: 'var(--color-accent)' }} />}
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 26 }}>
          {active ? 'Обрабатываем страницы' : `Задание ${JOB_STATUS_LABEL[job.status] ?? job.status}`}
        </span>
        <span style={{ flex: 1 }} />
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 34 }}>{pct}%</span>
      </div>
      <div
        style={{
          height: 10,
          background: 'color-mix(in srgb,var(--color-text) 9%,transparent)',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: 'repeating-linear-gradient(to right,var(--color-divider) 0 1px,transparent 1px 5%)',
        }}
      >
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, background: 'var(--color-accent)', width: `${pct}%` }} />
      </div>
      <div style={{ display: 'grid', gap: 1, border: '1px solid var(--color-divider)' }}>
        {steps.map(([name, note, state]) => (
          <div
            key={name}
            style={{
              outline: '1px solid var(--color-divider)',
              display: 'grid',
              gridTemplateColumns: 'auto minmax(0,1fr) auto',
              gap: 'var(--space-3)',
              padding: 'var(--space-3) var(--space-4)',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                flex: 'none',
                background: state === 'ожидает' ? 'color-mix(in srgb,var(--color-text) 20%,transparent)' : 'var(--color-accent)',
              }}
            />
            <span>
              <span style={{ display: 'block', fontSize: 14 }}>{name}</span>
              <span style={{ display: 'block', fontSize: 12, color: MUTED }}>{note}</span>
            </span>
            <span style={{ fontSize: 12.5, color: MUTED, textAlign: 'right' }}>{state}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 'var(--space-4)' }}>
        <Figure label="Обработано" value={job.total > 0 ? `${num(job.processed)} из ${num(job.total)} стр.` : '—'} />
        <Figure label="Страниц с рекомендациями" value={num(jobPages.length)} />
        <Figure label="Ошибок" value={num(job.failures.length)} />
      </div>
      <div
        style={{
          border: '1px solid var(--color-divider)',
          background: 'color-mix(in srgb,var(--color-text) 4%,transparent)',
          padding: 'var(--space-3)',
          fontFamily: MONO,
          fontSize: 11.5,
          lineHeight: 1.75,
          maxHeight: 150,
          overflowY: 'auto',
        }}
      >
        {log.length === 0 ? (
          <div style={{ color: MUTED }}>{job.error ?? 'Записей пока нет'}</div>
        ) : (
          log.map((line, i) => (
            <div key={i} style={{ color: 'color-mix(in srgb,var(--color-text) 72%,transparent)', wordBreak: 'break-all' }}>
              {line}
            </div>
          ))
        )}
      </div>
      <p style={{ fontSize: 12.5, color: MUTED, margin: 0 }}>
        Запуск {dateLong(job.createdAt)}. Страница обновляется сама, пока задание в работе.
      </p>
    </Blueprint>
  );
};

const Line: React.FC<{ label: string; value: string; accent?: boolean }> = ({ label, value, accent }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)', fontSize: 14, color: accent ? 'var(--color-accent-700)' : undefined }}>
    <span>{label}</span>
    <span style={{ fontFamily: 'var(--font-heading)', fontSize: 16, whiteSpace: 'nowrap' }}>{value}</span>
  </div>
);

const Figure: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: MUTED, marginBottom: 6 }}>{label}</div>
    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 22 }}>{value}</div>
  </div>
);

export default Order;
