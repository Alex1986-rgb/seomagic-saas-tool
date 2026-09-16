import React from 'react';
import { CircleCheck, ClipboardList, FileSearch, KeyRound, Landmark, Target, TriangleAlert, Wallet } from 'lucide-react';
import { H2, Lead, CELL } from './parts';

/**
 * SEO-текст «Как проверить подрядчика по SEO» с двумя таблицами макета.
 *
 * Первая таблица — общие признаки для любого подрядчика; она верна независимо от нас и перенесена
 * почти дословно. Вторая в макете сравнивала SeoMarket с абонентским SEO так, будто холд, превью,
 * доставка и акты уже работают. Это не так (см. Pay.tsx, Order.tsx, InvoiceRequest.tsx кабинета),
 * поэтому колонка SeoMarket разделена на «правило сервиса» и «что работает сейчас» — страница
 * про доверие не может сама нарушать признаки, которые советует проверять.
 * Статусы «сейчас» должны совпадать с тем, что говорит кабинет: подключили оплату или доставку —
 * поправить строку здесь.
 */

const SIGNS: { icon: React.ElementType; what: string; good: string; bad: string; hl?: boolean }[] = [
  { icon: Target, what: 'Обещания по позициям', good: 'Гарантируют объём работ, а не место в выдаче', bad: '«ТОП-10 за месяц или вернём деньги»' },
  {
    icon: FileSearch,
    what: 'Что видно до оплаты',
    good: 'Смета по фактическому объёму: какие правки, сколько, по какой ставке',
    bad: 'Пакет «Продвижение Стандарт» без состава работ',
    hl: true,
  },
  { icon: Wallet, what: 'Порядок оплаты', good: 'Оплата после приёмки либо холд до одобрения', bad: 'Предоплата за три месяца вперёд' },
  { icon: KeyRound, what: 'Доступы к сайту', good: 'Отдельный ключ или доступ под задачу, бэкап перед изменениями', bad: 'Требуют полный доступ к хостингу и почте домена' },
  { icon: ClipboardList, what: 'Отчётность', good: 'Список изменённых адресов со значениями до и после', bad: 'Отчёт из графиков без перечня работ' },
  { icon: Landmark, what: 'Реквизиты и документы', good: 'Реквизиты и оферта на сайте, акт по факту работ', bad: 'Только мессенджер и перевод на карту' },
];

type Status = 'works' | 'off';

const SCHEME: { q: string; sub: string; rule: string; status: Status; now: string; hl?: boolean }[] = [
  {
    q: 'За что платите',
    sub: 'За месяц работы команды',
    rule: 'За единицу правки по ставке из прайса',
    status: 'works',
    now: 'Смета считается по объёму из аудита и ставкам прайса',
  },
  {
    q: 'Когда списываются деньги',
    sub: 'Вперёд, до работ',
    rule: 'После одобрения превью исправленной копии',
    status: 'off',
    now: 'Приём оплаты и холд не подключены, счёт — по заявке из сметы',
  },
  {
    q: 'Что если не устроило',
    sub: 'Месяц оплачен, договариваться на следующий',
    rule: 'Превью не одобрено — холд снимается, списания нет',
    status: 'off',
    now: 'Превью исправленной копии пока не подключено',
  },
  {
    q: 'Сколько длится',
    sub: 'Бессрочно, помесячно',
    rule: 'Разовый заказ без абонентской платы',
    status: 'works',
    now: 'Подписок и пакетов нет',
    hl: true,
  },
  {
    q: 'Доступы к сайту',
    sub: 'Часто — полный доступ к хостингу',
    rule: 'Способ установки выбирается после одобрения превью',
    status: 'off',
    now: 'Установка правок не подключена, доступы к сайту не запрашиваем',
  },
  {
    q: 'Чем подтверждается',
    sub: 'Отчётом о проделанной работе',
    rule: 'Контрольным аудитом и перечнем изменённых адресов',
    status: 'off',
    now: 'Повторный аудит бесплатный и работает; перечень изменённого появится вместе с установкой',
  },
];

const td: React.CSSProperties = { fontSize: 14, color: CELL, verticalAlign: 'top' };
const first: React.CSSProperties = { paddingLeft: 24, fontSize: 15, verticalAlign: 'top' };
const caption: React.CSSProperties = { textAlign: 'center', fontSize: 15, margin: '0 0 12px', color: CELL };

export const ContractorCheck: React.FC = () => (
  <section aria-labelledby="rev-check" style={{ paddingBottom: 56 }}>
    <H2 id="rev-check">Как проверить подрядчика по SEO</H2>
    <Lead>
      Отзывы на сайте исполнителя — слабое доказательство: их публикует сам исполнитель. Смотреть надо на то, что можно проверить
      независимо: есть ли реквизиты, кто отвечает за результат по договору, что происходит с деньгами, если работа не устроила.
      Ниже признаки, по которым видно, чем закончится сотрудничество.
    </Lead>

    <p style={caption}>Признаки, которые проверяются до оплаты</p>
    {/* Прокрутка только внутри рамки: на 375px таблица шире экрана, а страница — нет. */}
    <div style={{ overflowX: 'auto', border: '1px solid var(--color-divider)', marginBottom: 44 }}>
      <table className="table" style={{ minWidth: 800 }}>
        <thead>
          <tr>
            <th scope="col" style={{ width: '26%', paddingLeft: 24 }}>Что смотреть</th>
            <th scope="col">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <CircleCheck size={16} strokeWidth={1.5} aria-hidden="true" style={{ flex: 'none' }} />
                Хороший признак
              </span>
            </th>
            <th scope="col">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <TriangleAlert size={16} strokeWidth={1.5} aria-hidden="true" style={{ flex: 'none' }} />
                Тревожный признак
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {SIGNS.map(({ icon: Icon, what, good, bad, hl }) => (
            <tr key={what} data-hl={hl ? '' : undefined}>
              <td style={{ ...first, fontWeight: hl ? 600 : undefined }}>
                <span style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                  <Icon size={18} strokeWidth={1.5} aria-hidden="true" style={{ flex: 'none', marginTop: 3, color: 'var(--color-accent)' }} />
                  <span>{what}</span>
                </span>
              </td>
              <td style={td}>{good}</td>
              <td style={td}>{bad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <p style={caption}>Чем наша схема отличается от абонентской — и что из неё уже работает</p>
    <div style={{ overflowX: 'auto', border: '1px solid var(--color-divider)' }}>
      <table className="table" style={{ minWidth: 960 }}>
        <thead>
          <tr>
            <th scope="col" style={{ width: '18%', paddingLeft: 24 }}>Вопрос</th>
            <th scope="col" style={{ width: '22%' }}>Абонентское SEO</th>
            <th scope="col" style={{ width: '28%' }}>SeoMarket: правило</th>
            <th scope="col">SeoMarket: сейчас</th>
          </tr>
        </thead>
        <tbody>
          {SCHEME.map(({ q, sub, rule, status, now, hl }) => (
            <tr key={q} data-hl={hl ? '' : undefined}>
              <td style={{ ...first, fontWeight: hl ? 600 : undefined }}>{q}</td>
              <td style={td}>{sub}</td>
              <td style={{ fontSize: 14, verticalAlign: 'top', fontWeight: hl ? 600 : undefined }}>{rule}</td>
              <td style={td}>
                <span style={{ display: 'grid', gap: 6, justifyItems: 'start' }}>
                  <span className={status === 'works' ? 'tag tag-accent' : 'tag tag-neutral'} style={{ whiteSpace: 'nowrap' }}>
                    {status === 'works' ? 'Работает' : 'Не подключено'}
                  </span>
                  <span>{now}</span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default ContractorCheck;
