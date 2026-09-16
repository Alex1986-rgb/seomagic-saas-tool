import React from 'react';
import { Link } from 'react-router-dom';
import { Files, House, LayoutDashboard, Newspaper, type LucideIcon } from 'lucide-react';
import { PageSeo } from '@/components/seo/PageSeo';
import { ARTICLES } from '@/site/blog/articles';
import { DocsLayout } from '@/site/docs/DocsLayout';
import { DOCS } from '@/site/docs/docs-list';
import { DocTitle, Kicker, Lead } from '@/site/docs/parts';

/**
 * «Карта сайта» (макет, строки 277–327) — все публичные адреса из брифа.
 *
 * Статьи — из общего списка блога (ARTICLES): новая статья появится здесь без правки карты.
 * Документы — из DOCS каркаса, чтобы оглавление и карта не расходились.
 */

interface Group {
  title: string;
  icon: LucideIcon;
  links: { to: string; label: string; icon?: LucideIcon }[];
}

const GROUPS: Group[] = [
  {
    title: 'Сервис',
    icon: House,
    links: [
      { to: '/', label: 'Главная' },
      { to: '/#kak', label: 'Как это работает' },
      { to: '/#uslugi', label: 'Услуги' },
      { to: '/#ceny', label: 'Цены' },
      { to: '/#metodika', label: 'Методика оптимизации' },
      { to: '/#proverki', label: 'Состав проверок' },
      { to: '/#organika', label: 'Органика в поиске' },
      { to: '/#faq', label: 'Частые вопросы' },
      { to: '/#audit', label: 'Проверить сайт' },
    ],
  },
  {
    title: 'Кабинет',
    icon: LayoutDashboard,
    links: [
      { to: '/app/login', label: 'Вход в кабинет' },
      { to: '/app/register', label: 'Регистрация' },
      { to: '/app/audit', label: 'Аудит сайта' },
      { to: '/app/estimate', label: 'Смета и заказ' },
      { to: '/app/positions', label: 'Позиции и конкуренты' },
      { to: '/app/reports', label: 'Отчёты' },
    ],
  },
  {
    title: 'Блог',
    icon: Newspaper,
    links: [
      ...ARTICLES.map((a) => ({ to: `/blog/${a.slug}`, label: a.title })),
      { to: '/blog', label: 'Все статьи' },
      { to: '/otzyvy', label: 'Отзывы' },
    ],
  },
  {
    title: 'Документы',
    icon: Files,
    links: DOCS.filter((d) => d.id !== 'sitemap').map((d) => ({ to: d.to, label: d.label, icon: d.icon })),
  },
];

const SiteMap: React.FC = () => (
  <DocsLayout current="sitemap">
    <PageSeo
      title="Карта сайта"
      description="Все страницы SeoMarket в одном списке: разделы главной, личный кабинет, статьи блога, отзывы, оферта, политика конфиденциальности и другие документы."
    />
    <Kicker>Навигация</Kicker>
    <DocTitle>Карта сайта</DocTitle>
    <Lead>Все страницы сервиса в одном списке — для поисковых роботов и для тех, кто ищет конкретный раздел.</Lead>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(230px,100%),1fr))', gap: 'var(--space-8)' }}>
      {GROUPS.map(({ title, icon: GroupIcon, links }) => (
        <div key={title}>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 18,
              letterSpacing: '.02em',
              textTransform: 'uppercase',
              margin: '0 0 12px',
              paddingBottom: 8,
              borderBottom: '1px solid var(--color-divider)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
            }}
          >
            <GroupIcon size={18} strokeWidth={1.5} aria-hidden="true" style={{ flex: 'none', color: 'var(--color-accent)' }} />
            {title}
          </h2>
          <div data-maplinks style={{ display: 'grid', gap: 8, fontSize: 14 }}>
            {links.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to}>
                {Icon && <Icon size={16} strokeWidth={1.5} aria-hidden="true" style={{ flex: 'none', marginTop: 1 }} />}
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  </DocsLayout>
);

export default SiteMap;
