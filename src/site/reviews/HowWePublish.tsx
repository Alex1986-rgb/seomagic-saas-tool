import React from 'react';
import { ClipboardList, FileCheck2, Hash, MessageSquareQuote, Undo2, UserCheck } from 'lucide-react';
import { SitePhoto } from '@/site/SitePhoto';
import { MUTED } from '@/site/SiteLayout';
import { H2, Lead, SOFT } from './parts';

/**
 * Вместо шести отзывов макета — правила, по которым отзывы появятся.
 *
 * В макете отзывы выдуманы: имена, компании, номера заказов, суммы и баллы. Завершённых заказов
 * у сервиса нет (приём оплаты и установка правок не подключены, см. src/cabinet/screens/Order.tsx),
 * значит, настоящих отзывов быть не может. Выдуманные отзывы — нарушение закона о рекламе
 * (недостоверная реклама) и повод для санкций поисковиков, поэтому страница честно говорит «пока нет».
 *
 * Правила ниже — обещание сервиса. Если какое-то из них поменяется, менять надо здесь же:
 * страница отзывов не должна обещать больше, чем реально соблюдается.
 */

const RULES: { icon: React.ElementType; title: string; text: string }[] = [
  {
    icon: FileCheck2,
    title: 'Только по завершённому заказу',
    text: 'Отзыв оставляет клиент, чей заказ дошёл до конца: правки одобрены и установлены на сайт. Отзывы без заказа не публикуются.',
  },
  {
    icon: UserCheck,
    title: 'С разрешения клиента',
    text: 'Текст, имя и название компании публикуем только с согласия автора. Можно подписаться инициалами или без имени.',
  },
  {
    icon: Hash,
    title: 'С номером заказа',
    text: 'Рядом с текстом — номер заказа, месяц и платформа сайта. По номеру отзыв сверяется с заказом в кабинете.',
  },
  {
    icon: ClipboardList,
    title: 'Цифры из отчёта',
    text: 'Балл аудита до и после — из двух аудитов того же сайта, объём и сумма — из сметы заказа. Со слов цифры не пишем, рост трафика правкам не приписываем.',
  },
  {
    icon: Undo2,
    title: 'Отзыв можно отозвать',
    text: 'Автор может в любой момент попросить снять отзыв или убрать из подписи имя и компанию — снимаем без условий.',
  },
  {
    icon: MessageSquareQuote,
    title: 'Недовольных не прячем',
    text: 'Отзыв о заказе, который не устроил, публикуется по тем же правилам, что и остальные.',
  },
];

/** Поле карточки-шаблона: подпись и пустое место под значение. */
const Slot: React.FC<{ label: string; hint: string }> = ({ label, hint }) => (
  <div style={{ display: 'grid', gap: 4, paddingBottom: 'var(--space-3)', borderBottom: '1px dashed var(--color-divider)' }}>
    <span style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: MUTED }}>{label}</span>
    <span style={{ fontSize: 14, lineHeight: 1.55, color: SOFT }}>{hint}</span>
  </div>
);

export const HowWePublish: React.FC = () => (
  <>
    <section aria-labelledby="rev-empty" style={{ paddingBottom: 56 }}>
      <H2 id="rev-empty">Отзывов пока нет</H2>
      <Lead>
        Сервис только запускается: приём оплаты и установка правок на сайт ещё не подключены, поэтому завершённых заказов, по
        которым можно оставить отзыв, пока нет. Придумывать отзывы не будем — ниже правила, по которым они появятся на этой
        странице.
      </Lead>
      {/* Сетка ячеек как у плиток-показателей макета: волосяные линии через outline + gap 1px. */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))',
          gap: 1,
          border: '1px solid var(--color-divider)',
        }}
      >
        {RULES.map(({ icon: Icon, title, text }) => (
          <div key={title} style={{ outline: '1px solid var(--color-divider)', padding: 'var(--space-6)', display: 'grid', gap: 10, alignContent: 'start' }}>
            <Icon size={20} strokeWidth={1.5} aria-hidden="true" style={{ color: 'var(--color-accent)' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, letterSpacing: '.02em', textTransform: 'uppercase', margin: 0 }}>
              {title}
            </h3>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, margin: 0, color: SOFT }}>{text}</p>
          </div>
        ))}
      </div>
    </section>

    {/*
      Карточка-шаблон: вёрстка отзыва из макета (два кадра + метки + текст + подпись), но вместо
      значений — пустые поля с подписями. Оставили её, а не убрали, потому что она показывает, какие
      данные будут у каждого отзыва, и так их можно проверять заранее. От подделки её отличает:
      ни имени, ни компании, ни цифр, ни цитаты; явная метка «пример оформления, не отзыв»;
      в разметке нет schema.org/Review. Фото — стоковые (Unsplash), это сказано под ними.
    */}
    <section aria-labelledby="rev-template" style={{ paddingBottom: 64 }}>
      <H2 id="rev-template">Как будет выглядеть отзыв</H2>
      <Lead>Каждый отзыв будет оформлен одинаково — с данными, которые можно сверить с заказом и отчётами аудита.</Lead>
      <article
        data-two
        aria-label="Пример оформления отзыва, не настоящий отзыв"
        style={{
          display: 'grid',
          gridTemplateColumns: '320px minmax(0,1fr)',
          gap: 'clamp(24px,3vw,48px)',
          alignItems: 'start',
          border: '1px dashed var(--color-divider)',
          padding: 'clamp(16px,3vw,32px)',
        }}
      >
        <div style={{ display: 'grid', gap: 12 }}>
          <SitePhoto id="rev-1a" aspect="4/5" />
          <SitePhoto id="rev-1b" aspect="3/2" />
          <p style={{ fontSize: 12.5, lineHeight: 1.5, margin: 0, color: MUTED }}>
            Фото — иллюстрации со стока. У опубликованного отзыва здесь будут снимки, которые пришлёт автор, или их не будет вовсе.
          </p>
        </div>
        <div style={{ minWidth: 0, display: 'grid', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="tag tag-neutral" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>
              Пример оформления — не отзыв
            </span>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="tag tag-accent">Балл до → после</span>
            <span className="tag tag-outline">Объём, страниц</span>
            <span className="tag tag-outline">Сумма по заказу</span>
          </div>
          <Slot
            label="Текст отзыва"
            hint="Слова автора — как он их написал. Исправляем только опечатки и только с его согласия."
          />
          <Slot label="Подпись" hint="Имя или инициалы, должность и компания — если автор разрешил. Можно без подписи." />
          <Slot label="Заказ" hint="Номер заказа · месяц · тип сайта и CMS." />
          <Slot
            label="Откуда цифры"
            hint="Балл — из первого аудита и контрольного после установки, объём и сумма — из сметы заказа."
          />
        </div>
      </article>
    </section>
  </>
);

export default HowWePublish;
