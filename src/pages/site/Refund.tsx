import React from 'react';
import { Link } from 'react-router-dom';
import { PageSeo } from '@/components/seo/PageSeo';
import { DocsLayout } from '@/site/docs/DocsLayout';
import { Blueprint, DocTitle, EditionNote, H2, Kicker, LaterTag, Lead, P, TableBox } from '@/site/docs/parts';
import { tdFirst, tdRight, tdText } from '@/site/docs/styles';

/**
 * «Возврат и гарантии» (макет, строки 221–244).
 *
 * Сейчас оплата не принимается (InvoiceRequest.tsx), поэтому возвращать нечего — это первое, что
 * видит читатель. Таблица исходов описывает порядок после подключения оплаты и совпадает с офертой.
 * Не перенесено:
 *  - «восстанавливаем затёртые правки бесплатно 90 дней» и «проверка раз в неделю автоматически» —
 *    слежения за затиранием правок в коде нет, обещать его нельзя;
 *  - «повторный аудит через 30 дней бесплатно» — аудит бесплатный всегда, без срока;
 *  - сроки «1–3 дня», «3–5 дней» — не подтверждены: срок снятия блокировки зависит от банка;
 *  - hello@seomarket.ru — почты нет, запрос через форму заявки.
 */

interface Outcome {
  when: string;
  money: string;
  term: string;
  hl?: boolean;
}

const OUTCOMES: Outcome[] = [
  { when: 'Превью не устроило', money: 'Блокировка снимается полностью, списания не происходит', term: 'Зависит от банка' },
  { when: 'Правка не прошла проверку', money: 'Исключается из счёта, сумма пересчитывается до списания', term: 'До списания' },
  {
    when: 'Установка сломала сайт',
    money: 'Откат из резервной копии, снятой перед установкой, и возврат суммы',
    term: 'По заявке',
    hl: true,
  },
  { when: 'Работы приняты, позиции не выросли', money: 'Возврат не производится: оплачен объём правок, а не позиции', term: '—' },
];

const Refund: React.FC = () => (
  <DocsLayout current="refund">
    <PageSeo
      title="Возврат и гарантии"
      description="Что происходит с деньгами в SeoMarket: сейчас оплата не принимается; после подключения сумма блокируется до одобрения превью и списывается только за принятые правки."
    />
    <Kicker>Гарантии</Kicker>
    <DocTitle>Возврат и гарантии</DocTitle>
    <Lead last={false}>
      Схема оплаты построена так, что возврат в большинстве случаев не нужен: деньги замораживаются и списываются только
      после того, как вы одобрили результат.
    </Lead>
    <Blueprint style={{ padding: 'var(--space-6)', maxWidth: '78ch', marginBottom: 32 }}>
      <p style={{ fontSize: 15, lineHeight: 1.65, margin: 0 }}>
        <strong>Сейчас оплата не принимается</strong> — ни картой, ни по счёту, поэтому и возвращать нечего. По
        согласованной смете в кабинете можно оставить заявку на счёт; счёт выставляется после регистрации юрлица. Порядок
        ниже начнёт действовать после подключения приёма оплаты.
      </p>
    </Blueprint>

    <H2 gap={16}>
      Возможные исходы <LaterTag />
    </H2>
    <TableBox minWidth={740} label="Что происходит с деньгами">
      <thead>
        <tr>
          <th scope="col" style={{ width: '32%', paddingLeft: 24 }}>Ситуация</th>
          <th scope="col">Что происходит с деньгами</th>
          <th scope="col" style={{ textAlign: 'right' }}>Срок</th>
        </tr>
      </thead>
      <tbody>
        {OUTCOMES.map((o) => (
          <tr key={o.when} data-hl={o.hl ? '' : undefined}>
            <td style={{ ...tdFirst, fontWeight: o.hl ? 600 : undefined }}>{o.when}</td>
            <td style={tdText}>{o.money}</td>
            <td style={{ ...tdRight, fontWeight: o.hl ? 600 : undefined }}>{o.term}</td>
          </tr>
        ))}
      </tbody>
    </TableBox>

    <H2>Что входит в гарантию</H2>
    <P mb={12}>
      Мы гарантируем то, что можно проверить: правки из сметы внесены, а правка, не прошедшая проверку по нормам из{' '}
      <Link to="/#metodika">методики</Link>, не применяется и не попадает в счёт. Повторный аудит бесплатный в любой
      момент — после установки правок он покажет, какие замечания остались. Позиции и трафик не гарантируем: ими не
      управляет ни один подрядчик.
    </P>
    <P mb={0}>
      Возврат оформляется на тот же способ оплаты. Для возврата оставьте <Link to="/contact#zayavka">заявку</Link> с
      почты, указанной в аккаунте, и укажите сайт и номер сметы.
    </P>

    <EditionNote />
  </DocsLayout>
);

export default Refund;
