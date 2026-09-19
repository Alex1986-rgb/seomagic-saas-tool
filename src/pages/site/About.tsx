import React from 'react';
import { Link } from 'react-router-dom';
import { Ban, Calculator, CircleCheck, FilePenLine, HardDriveUpload, Lock, ScanSearch, type LucideIcon } from 'lucide-react';
import { PageSeo } from '@/components/seo/PageSeo';
import { DocsLayout } from '@/site/docs/DocsLayout';
import { Blueprint, DocTitle, H2, IconPara, Kicker, LaterTag, Lead, TableBox } from '@/site/docs/parts';
import { tdRight, tdText } from '@/site/docs/styles';

/**
 * «О сервисе» (макет, строки 59–88).
 *
 * Команды и истории в макете нет — и здесь не выдумываем. Не перенесено:
 *  - «214 проверок по каждому адресу» — число не подтверждено кодом аудита, сказано без числа;
 *  - «контрольный аудит покажет балл копии» — балл после правок никто не пересчитывает
 *    (см. src/cabinet/screens/Optimize.tsx), копии сайта на поддомене пока нет.
 * Этапы оплаты, превью и установки описаны как порядок после подключения: сейчас приёма оплаты
 * нет (InvoiceRequest.tsx — заявка на счёт), превью и установки тоже (admin/HostingTab.tsx).
 */

interface Stage {
  icon: LucideIcon;
  name: string;
  what: React.ReactNode;
  who: string;
  later?: boolean;
  hl?: boolean;
}

const STAGES: Stage[] = [
  { icon: ScanSearch, name: 'Аудит', what: 'Обход сайта, проверка каждой найденной страницы, отчёт с замечаниями', who: 'Бесплатно' },
  { icon: Calculator, name: 'Смета', what: 'Вы выбираете строки работ, сумма пересчитывается по ставкам за единицу', who: 'Бесплатно' },
  {
    icon: FilePenLine,
    name: 'Правки',
    what: 'Языковая модель предлагает title, description, тексты и заголовки для страниц с замечаниями — «было» и «стало» видны в кабинете',
    who: 'По смете',
  },
  {
    icon: Lock,
    name: 'Оплата',
    what: 'Сейчас через сайт не принимается — из кабинета оставляется заявка на счёт. После подключения деньги замораживаются в холде, а не списываются',
    who: 'Холд',
    later: true,
    hl: true,
  },
  { icon: CircleCheck, name: 'Одобрение', what: 'Вы смотрите превью исправленной копии. Не устроило — холд снимается', who: 'Списание', later: true },
  { icon: HardDriveUpload, name: 'Установка', what: 'Способ согласуем: файлы для вашего разработчика или установка с резервной копией', who: '—', later: true },
];

const About: React.FC = () => (
  <DocsLayout current="about">
    <PageSeo
      title="О сервисе — технический аудит и исправление сайтов"
      description="SeoMarket — сервис технической оптимизации сайтов: бесплатный аудит, смета по ставкам за единицу работы, оплата только за фактический объём правок. Без абонентской платы и пакетов."
    />
    <Kicker>О сервисе</Kicker>
    <DocTitle>Кто мы и что делаем</DocTitle>
    <Lead last={false}>
      SeoMarket — сервис технической оптимизации сайтов. Мы обходим сайт краулером, находим ошибки, которые мешают
      поисковикам его индексировать и ранжировать, и готовим исправления. Аудит бесплатный. Платите только за
      фактический объём внесённых правок.
    </Lead>
    <Lead>
      Мы не продаём «SEO в месяц» и не берём абонентскую плату. Объём работ известен только после обхода: у сайта на
      50 страниц и у каталога на десятки тысяч он отличается в сотни раз. Поэтому цена складывается из ставок за единицу
      работы, умноженных на то, что действительно нашлось.
    </Lead>

    <H2 size={26} gap={16}>Как устроена работа</H2>
    <TableBox minWidth={680} mb={32} label="Этапы работы">
      <thead>
        <tr>
          <th scope="col" style={{ width: '26%', paddingLeft: 24 }}>Этап</th>
          <th scope="col">Что происходит</th>
          <th scope="col" style={{ textAlign: 'right' }}>Кто платит</th>
        </tr>
      </thead>
      <tbody>
        {STAGES.map(({ icon: Icon, name, what, who, later, hl }) => (
          <tr key={name} data-hl={hl ? '' : undefined}>
            <td style={{ paddingLeft: 24, fontSize: 15, fontWeight: hl ? 600 : undefined }}>
              <span style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                <Icon size={18} strokeWidth={1.5} aria-hidden="true" style={{ flex: 'none', marginTop: 3, color: 'var(--color-accent)' }} />
                <span>{name}</span>
              </span>
            </td>
            <td style={tdText}>
              {what}
              {later && (
                <>
                  {' '}
                  <LaterTag />
                </>
              )}
            </td>
            <td style={{ ...tdRight, fontWeight: hl ? 600 : undefined }}>{who}</td>
          </tr>
        ))}
      </tbody>
    </TableBox>

    <H2 size={26} gap={16}>Чего мы не обещаем</H2>
    <Blueprint style={{ padding: 'clamp(20px,2.6vw,32px)', maxWidth: '78ch' }}>
      <IconPara icon={Ban} mb={14}>
        Мы не гарантируем позиции в поиске и конкретные проценты роста трафика. Позиции зависят от конкуренции, возраста
        домена, коммерческих факторов и алгоритмов поисковиков — ни один подрядчик ими не управляет. Любая гарантия
        «ТОП-10 за месяц» — признак того, что вам продают лотерею.
      </IconPara>
      <IconPara icon={CircleCheck} mb={0}>
        Что можно проверить самому: состав правок записан в смете, предложенные тексты видны в кабинете рядом с
        исходными, а повторный аудит бесплатный и показывает, какие замечания остались. Правка, которая не проходит
        проверку по нормам из <Link to="/#metodika">методики</Link>, не применяется и убирается из счёта.
      </IconPara>
    </Blueprint>
  </DocsLayout>
);

export default About;
