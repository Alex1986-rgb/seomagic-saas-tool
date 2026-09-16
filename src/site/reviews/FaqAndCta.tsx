import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, CircleHelp } from 'lucide-react';
import { H2, Kicker, SOFT } from './parts';

/**
 * Частые вопросы и призыв из макета, приведённые к правде.
 *
 * Что изменено против макета и почему:
 * — «Отзывы можно проверить»: отзывов нет, поэтому ответ описывает, как их можно будет проверить;
 *   сверка балла опирается на бесплатный повторный аудит, который реально работает.
 * — «Почему нет роста трафика»: убрана «засечка даты установки на графике позиций» — в кабинете её нет.
 * — «Бывает, что работа не подходит»: убраны «6 % отказов» (данных нет) и сказано, что превью и холд
 *   пока не подключены.
 * — «Юрлица по договору»: счёт выставляется по заявке, закрывающие документы кабинет пока не формирует
 *   (так же сказано на экране оплаты).
 */

const FAQ: { q: string; a: string }[] = [
  {
    q: 'Как проверить отзыв',
    a: 'У каждого отзыва будет номер заказа и месяц. Балл до и после сверяется сам: если автор разрешил указать адрес сайта, запустите по нему бесплатный аудит и сравните. По запросу свяжем с автором напрямую — только при его согласии.',
  },
  {
    q: 'Почему нет роста трафика в цифрах',
    a: 'Трафик зависит от сезона, конкуренции и рекламы, которую клиент ведёт параллельно. Приписывать его правкам нельзя. Измеримое — балл аудита и объём исправленного. Позиции можно отслеживать в кабинете, но их движение мы правкам не приписываем.',
  },
  {
    q: 'Бывает, что работа не подходит',
    a: 'Да. Например, на самописных CMS страницы собираются динамически, и статическая копия может работать неправильно. По правилам сервиса такое превью не одобряют и деньги не списываются. Превью и холд пока не подключены — в кабинете это отмечено прямо на шагах заказа.',
  },
  {
    q: 'Работаете ли с юрлицами',
    a: 'Счёт выставляем по заявке из сметы в кабинете, условия — в оферте. Закрывающие документы в кабинете пока не формируются.',
  },
];

export const ReviewsFaq: React.FC = () => (
  <section aria-labelledby="rev-faq" style={{ paddingBottom: 56 }}>
    {/* В макете у блока только надзаголовок, а вопросы — h3. Чтобы порядок заголовков не прыгал
        h2→h3 мимо секции, надзаголовок размечен как h2, внешне оставаясь надзаголовком. */}
    <h2 id="rev-faq" style={{ margin: 0 }}>
      <Kicker mb={12}>Частые вопросы</Kicker>
    </h2>
    <hr style={{ height: 1, border: 0, margin: '0 0 36px', background: 'var(--color-divider)' }} />
    <div data-two style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 'clamp(28px,3.5vw,56px)' }}>
      {FAQ.map(({ q, a }) => (
        <div key={q}>
          <h3
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--space-3)',
              fontFamily: 'var(--font-heading)',
              fontSize: 20,
              letterSpacing: '.02em',
              textTransform: 'uppercase',
              margin: '0 0 10px',
            }}
          >
            <CircleHelp size={20} strokeWidth={1.5} aria-hidden="true" style={{ flex: 'none', marginTop: 1, color: 'var(--color-accent)' }} />
            <span>{q}</span>
          </h3>
          <p style={{ fontSize: 14.5, lineHeight: 1.6, margin: 0, color: SOFT }}>{a}</p>
        </div>
      ))}
    </div>
  </section>
);

export const ReviewsCta: React.FC = () => (
  <section style={{ paddingBottom: 64 }}>
    <div className="blueprint" style={{ padding: 'clamp(28px,4vw,56px)', display: 'grid', gap: 'var(--space-4)', justifyItems: 'start' }}>
      <i className="corner tl" />
      <i className="corner tr" />
      <i className="corner bl" />
      <i className="corner br" />
      <H2 style={{ lineHeight: 1.12, margin: 0, maxWidth: '26ch' }}>Проверьте сайт и посмотрите смету</H2>
      <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0, maxWidth: '56ch', color: SOFT }}>
        Аудит бесплатный, карта не нужна. Смету по найденному увидите до любой оплаты.
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginTop: 'var(--space-2)' }}>
        <Link to="/#audit" className="btn btn-primary">
          Запустить аудит
          <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" style={{ flex: 'none' }} />
        </Link>
        <Link to="/#ceny" className="btn btn-secondary">
          <Calculator size={16} strokeWidth={1.5} aria-hidden="true" style={{ flex: 'none' }} />
          Посмотреть цены
        </Link>
      </div>
    </div>
  </section>
);
