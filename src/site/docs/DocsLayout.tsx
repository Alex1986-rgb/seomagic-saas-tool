import React from 'react';
import { Link } from 'react-router-dom';
import { ArticleRail } from '@/site/blog/ArticleRail';
import { MUTED, SITE_GUTTER, SiteLayout } from '@/site/SiteLayout';
import { DOCS, type DocId } from './docs-list';
import './docs.css';

/**
 * Каркас раздела «Документы» (макет «SeoMarket Документы.dc.html», строки 44–57).
 *
 * В макете восемь документов жили на одной странице и переключались состоянием с якорем #about.
 * На рабочем сайте это восемь адресов: у каждого документа свой title, canonical и строка в
 * sitemap, иначе поисковик видит одну страницу вместо восьми. Оглавление слева общее, текущий
 * пункт подсвечивается через data-on — так же, как в макете (правила в site.css).
 */

export const DocsLayout: React.FC<{ current: DocId; children: React.ReactNode }> = ({ current, children }) => (
  <SiteLayout>
    <div
      data-layout
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: `clamp(28px,4vw,56px) ${SITE_GUTTER} 80px`,
        display: 'grid',
        gridTemplateColumns: '230px minmax(0,1fr)',
        gap: 'clamp(28px,4vw,64px)',
        alignItems: 'start',
      }}
    >
      <nav
        data-toc
        aria-label="Документы"
        style={{ position: 'sticky', top: 96, borderLeft: '1px solid var(--color-divider)', paddingLeft: 'var(--space-4)' }}
      >
        <span
          style={{ display: 'block', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: MUTED, marginBottom: 10 }}
        >
          Разделы
        </span>
        <div data-toclist>
          {DOCS.map(({ id, to, label, icon: Icon }) => (
            <Link
              key={id}
              to={to}
              data-tocitem
              data-on={id === current ? '1' : '0'}
              aria-current={id === current ? 'page' : undefined}
              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
            >
              <Icon size={16} strokeWidth={1.5} aria-hidden="true" style={{ flex: 'none' }} />
              {label}
            </Link>
          ))}
        </div>
      </nav>

      <main style={{ minWidth: 0, display: 'grid', gap: 'var(--space-8)' }}>
        <article data-doc id={current} style={{ minWidth: 0 }}>
          {children}
        </article>
      </main>
    </div>

    {/* Карусель статей под каждым документом (макет, строки 332–336): из юридического раздела
        иначе некуда идти дальше, а блог даёт посетителю следующий шаг и роботу — внутренние ссылки. */}
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: `0 ${SITE_GUTTER} 88px` }}>
      <ArticleRail />
    </div>
  </SiteLayout>
);

export default DocsLayout;
