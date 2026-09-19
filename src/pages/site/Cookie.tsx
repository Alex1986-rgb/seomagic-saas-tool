import React from 'react';
import { PageSeo } from '@/components/seo/PageSeo';
import { DocsLayout } from '@/site/docs/DocsLayout';
import { DocTitle, EditionNote, H2, Kicker, Lead, P, TableBox } from '@/site/docs/parts';
import { tdFirst, tdRight, tdText } from '@/site/docs/styles';

/**
 * «Обработка cookie» (макет, строки 200–219), переписанная по тому, что сайт реально пишет в браузер.
 *
 * Проверено по коду (grep localStorage/sessionStorage/document.cookie и metrika|gtag|ym():
 *  - cookie сайт не ставит: сессия Supabase лежит в localStorage (integrations/supabase/client.ts),
 *    единственная запись document.cookie — в components/ui/sidebar.tsx, который нигде не подключён;
 *  - счётчиков аналитики (Метрика, Google Analytics) нет — строку «Аналитика» из макета не переносим;
 *  - «Защита форм, токен против подделки запросов» — такого токена нет, не переносим;
 *  - «Отключить в разделе „Настройки“ кабинета» — такой настройки нет.
 * Появится счётчик или новый ключ — дописать строку сюда, иначе документ станет ложью.
 */

interface Row {
  purpose: string;
  keys: string[];
  what: string;
  term: string;
  required: boolean;
}

const ROWS: Row[] = [
  {
    purpose: 'Сессия',
    keys: ['sb-…-auth-token'],
    what: 'Держит вас в кабинете между страницами и визитами (Supabase)',
    term: 'До выхода',
    required: true,
  },
  {
    purpose: 'Проверка с главной',
    keys: ['seomarket:landing-audit'],
    what: 'Номер идущей бесплатной проверки — чтобы перезагрузка страницы её не потеряла',
    term: 'До закрытия вкладки',
    required: false,
  },
  {
    purpose: 'Обновление сайта',
    keys: ['seo-market-chunk-reload'],
    what: 'Не даёт странице бесконечно перезагружаться, если вышла новая версия сайта',
    term: 'До закрытия вкладки',
    required: false,
  },
  {
    purpose: 'Настройки вида',
    keys: ['seomarket-cabinet-theme', 'seomarket-cabinet-project', 'seo-market-theme'],
    what: 'Запоминает тему оформления и выбранный в кабинете проект',
    term: 'Пока не очистите',
    required: false,
  },
  {
    purpose: 'Старая страница проверки',
    keys: ['task_id_<адрес>', 'audit_tab_<адрес>', 'auditData_<адрес>', 'pdf_reports_history'],
    what: 'Номер гостевой проверки (чтобы вы видели только свои), открытая вкладка отчёта, кэш результатов, список выгруженных PDF',
    term: 'Пока не очистите',
    required: false,
  },
];

const Cookie: React.FC = () => (
  <DocsLayout current="cookie">
    <PageSeo
      title="Обработка cookie"
      description="Что сайт SeoMarket хранит в браузере: cookie не ставятся, счётчиков аналитики и рекламы нет. Список ключей хранилища браузера, их назначение и срок."
    />
    <Kicker>Cookie</Kicker>
    <DocTitle>Обработка cookie</DocTitle>
    <Lead>
      Cookie и похожие на них записи — небольшие данные, которые сайт сохраняет в браузере. SeoMarket cookie не ставит:
      всё, что нужно для работы, хранится в хранилище браузера (localStorage и sessionStorage). Ниже — полный список
      этих записей.
    </Lead>

    <TableBox minWidth={760} mb={24} label="Записи в браузере">
      <thead>
        <tr>
          <th scope="col" style={{ width: '22%', paddingLeft: 24 }}>Назначение</th>
          <th scope="col">Что делает</th>
          <th scope="col" style={{ textAlign: 'right' }}>Срок</th>
          <th scope="col">Можно отключить</th>
        </tr>
      </thead>
      <tbody>
        {ROWS.map((r) => (
          <tr key={r.purpose}>
            <td style={tdFirst}>{r.purpose}</td>
            <td style={tdText}>
              {r.what}
              <span style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                {r.keys.map((k) => (
                  <code key={k} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, padding: '1px 5px', border: '1px solid var(--color-divider)' }}>
                    {k}
                  </code>
                ))}
              </span>
            </td>
            <td style={tdRight}>{r.term}</td>
            <td>
              <span className={r.required ? 'tag tag-outline' : 'tag tag-accent'}>{r.required ? 'Нет' : 'Да'}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </TableBox>

    <H2>Аналитика и реклама</H2>
    <P>
      Счётчиков посещаемости (Яндекс Метрики, Google Analytics и подобных), рекламных и трекинговых cookie сторонних
      сетей на сайте нет. Если счётчик появится, мы допишем его в этот список до подключения.
    </P>

    <H2>Как отключить</H2>
    <P mb={0}>
      Очистить записи можно в настройках браузера: «Данные сайтов» или «Файлы cookie и данные сайтов». Необязательные
      записи сайт просто создаст заново при следующем действии. Если удалить запись сессии, придётся снова войти в
      кабинет, а если запретить хранилище браузера полностью — вход станет невозможен.
    </P>

    <EditionNote />
  </DocsLayout>
);

export default Cookie;
