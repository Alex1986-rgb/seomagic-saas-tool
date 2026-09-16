import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CopyButton, MUTED, NotConnected } from '../ui';
import { dateLong, num } from '../format';
import { useCabinetProject } from '../project';
import { CodeBox, OffTag, Row } from '../account/parts';
import { SettingsSection } from '../account/SettingsSection';
import { ProviderSection } from '../account/ProviderSection';
import { SecuritySection } from '../account/SecuritySection';
import { ProfileSections } from '../account/ProfileSections';

/**
 * «Настройки проекта» (макет, строки 1588–1784).
 *
 * Порядок разделов — как в макете: наши адреса → сканирование → поставщик выдачи →
 * интеграции → команда → оплата → безопасность. В конце добавлены «Профиль» и «Уведомления» —
 * в макете их нет, а в продукте это единственные настройки, которые реально сохраняются.
 *
 * Настроек проекта в базе нет (проект = хост из аудитов, src/cabinet/project.tsx), поэтому всё,
 * что в макете хранится «на проект» — расписание, лимиты, IP, интеграции, команда, способы
 * оплаты, — показано как не подключённое, с перечнем того, чего не хватает.
 */

/**
 * User-Agent обходчика — строка из supabase/functions/audit-processor/index.ts (и _shared/compression.ts).
 * Держим копией: из браузера код функции не прочитать. Поменяли там — поменять здесь,
 * иначе клиент разрешит в фаерволе не тот робот.
 */
const CRAWLER_UA = 'Mozilla/5.0 (compatible; SEO-Auditor/1.0)';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { host, project, projectAudits, loading } = useCabinetProject();

  // «Подключён» в макете = дата создания проекта. Таблицы проектов нет — берём первый аудит хоста.
  const firstAudit = useMemo(() => {
    const dated = projectAudits.filter((a) => a.createdAt);
    return dated.length ? dated[dated.length - 1] : null;
  }, [projectAudits]);

  const lastUrl = project?.lastAudit.url ?? null;
  const pagesScanned = project?.lastCompleted?.pagesScanned ?? null;
  const ownerName = user.profile?.full_name || '—';
  const ownerMail = user.user?.email ?? user.profile?.email ?? '';

  let lead: React.ReactNode;
  if (loading) lead = 'Загрузка проекта…';
  else if (host && firstAudit?.createdAt)
    lead = `${host} · первый аудит ${dateLong(firstAudit.createdAt, false)} ${new Date(firstAudit.createdAt).getFullYear()}`;
  else if (host) lead = host;
  else
    lead = (
      <>
        Проекта пока нет — он появится с первым аудитом. <Link to="/app/audit">Запустить аудит</Link>. Настройки аккаунта ниже
        работают и без проекта.
      </>
    );

  return (
    <div data-screen style={{ maxWidth: 840, display: 'grid', gap: 'var(--space-8)', minWidth: 0 }}>
      <div>
        <h1 style={{ fontSize: 36, margin: '0 0 4px' }}>Настройки проекта</h1>
        <p style={{ fontSize: 14, color: MUTED, margin: 0, wordBreak: 'break-word' }}>{lead}</p>
      </div>

      {/* НАШИ АДРЕСА. Самая частая причина сорванного аудита — фаервол хостинга или Cloudflare режет
          обходчик после первых сотен запросов. Подсети из макета выдуманы: аудит идёт из облачных
          функций Supabase, у которых нет закреплённых исходящих адресов. Настоящее, что можно дать
          клиенту до обхода, — User-Agent обходчика. */}
      <SettingsSection
        blueprint
        gap="var(--space-6)"
        head={
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <h2 style={{ fontSize: 18, margin: '0 0 4px' }}>Наши IP для белого списка</h2>
              <p style={{ fontSize: 12.5, lineHeight: 1.55, color: MUTED, margin: 0, maxWidth: '66ch' }}>
                Если хостинг, WAF или Cloudflare ограничивает роботов, обход оборвётся на первых сотнях запросов и в отчёт попадёт
                часть сайта. Разрешите наш обходчик на время аудита.
              </p>
            </div>
            <CopyButton text={CRAWLER_UA} label="Скопировать User-Agent" />
          </div>
        }
      >
        <NotConnected
          title="Список исходящих адресов"
          needs={[
            'выделенный исходящий адрес или прокси для обходчика — тогда появятся подсети и строка для .htaccess',
            'проверка доступа: пробный обход с отчётом, сколько страниц ответили 200',
          ]}
        >
          Аудит обходит сайт из облачных функций без закреплённых адресов, поэтому постоянного списка IP пока нет. Разрешать
          обходчик приходится по User-Agent.
        </NotConnected>

        <div>
          <div style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: MUTED, marginBottom: 6 }}>Наш User-Agent</div>
          <CodeBox>{CRAWLER_UA}</CodeBox>
        </div>

        <div style={{ display: 'grid', gap: 'var(--space-2)', borderTop: '1px solid var(--color-divider)', paddingTop: 'var(--space-4)' }}>
          <div style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: MUTED, marginBottom: 2 }}>
            Где обычно нужно разрешить
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, display: 'grid', gap: 4 }}>
            <li>Cloudflare — правило пропуска для этого User-Agent, иначе включается проверка браузера</li>
            <li>Защита от DDoS у хостинга — лимит частоты запросов на время обхода</li>
            <li>Basic-авторизация на тестовом домене — закрытые паролем страницы обходчик не увидит</li>
          </ul>
        </div>
      </SettingsSection>

      <SettingsSection title="Сканирование" gap="var(--space-6)">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 'var(--space-6)' }}>
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="st1">Домен</label>
            <input id="st1" className="input" type="text" value={lastUrl ?? ''} placeholder="Появится после первого аудита" readOnly />
          </div>
          {/* Лимит страниц в продукте задаётся на каждый запуск аудита, а не на проект, — показываем
              факт последнего завершённого прохода. */}
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="st2">Страниц в последнем аудите</label>
            <input id="st2" className="input" type="text" value={pagesScanned === null ? '—' : num(pagesScanned)} readOnly />
          </div>
        </div>
        <NotConnected
          title="Расписание и параметры обхода"
          needs={[
            'хранение настроек проекта: лимит страниц, robots.txt, Core Web Vitals, страницы с параметрами',
            'планировщик повторных аудитов — вручную, еженедельно, ежедневно',
          ]}
          action={
            <Link to={lastUrl ? `/app/audit?url=${encodeURIComponent(lastUrl)}` : '/app/audit'} className="btn btn-secondary">
              Запустить аудит вручную
            </Link>
          }
        >
          Сейчас аудит запускается вручную, параметры обхода выбираются при запуске.
        </NotConnected>
      </SettingsSection>

      <ProviderSection userId={user.user?.id ?? null} />

      <SettingsSection title="Интеграции">
        <Row title="Яндекс Вебмастер" sub="Данные по индексации и запросам" right={<OffTag />} />
        <Row title="Google Search Console" sub="Показы, клики, средняя позиция" right={<OffTag />} />
        <Row title="1С-Битрикс" sub="Применение правок прямо в CMS" right={<OffTag />} last />
        <p style={{ fontSize: 12.5, color: MUTED, margin: 0 }}>
          Чего не хватает: OAuth-подключение к Вебмастеру и Search Console с хранением токенов, модуль для 1С-Битрикс.
        </p>
      </SettingsSection>

      {/* Команда: участник один — сам пользователь, это настоящие данные входа. Ролей и приглашений нет. */}
      <SettingsSection title="Команда">
        <Row title={ownerName} sub={ownerMail} right={<span className="tag tag-neutral">Владелец</span>} />
        <NotConnected
          title="Приглашение участников"
          needs={['таблица участников проекта с ролями', 'приглашения по почте', 'права участников в политиках базы']}
        />
      </SettingsSection>

      {/* Оплата: формулировка — из правил продукта (design/seomarket-v2/CLAUDE.md), чтобы не разойтись
          с лендингом и сметой: подписок нет, платят за фактический объём, деньги в холде до одобрения. */}
      <SettingsSection title="Оплата">
        <p style={{ fontSize: 13.5, color: MUTED, margin: 0, maxWidth: '60ch' }}>
          Подписки нет — оплата за фактический объём правок. Деньги держатся в холде до одобрения превью исправленной копии.
        </p>
        <NotConnected
          title="Способы оплаты и история платежей"
          needs={['платёжный шлюз с холдом (СБП, карта, счёт для юрлиц)', 'таблица платежей и счетов']}
        />
      </SettingsSection>

      <SecuritySection />

      <ProfileSections />
    </div>
  );
};

export default Settings;
