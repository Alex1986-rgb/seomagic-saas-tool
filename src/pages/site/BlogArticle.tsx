import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, CircleHelp, Clock, FileText, List, Tag } from 'lucide-react';
import { PageSeo } from '@/components/seo/PageSeo';
import { SiteContainer, SiteLayout } from '@/site/SiteLayout';
import { SitePhoto } from '@/site/SitePhoto';
import { PHOTOS } from '@/site/photos';
import { formatArticleDate, getArticle, relatedArticles } from '@/site/blog/articles';
import type { Article } from '@/site/blog/articles';
import { ArticleSections } from '@/site/blog/ArticleBlocks';
import { ArticleJsonLd } from '@/site/blog/ArticleJsonLd';
import { ArticleRail } from '@/site/blog/ArticleRail';
import { Inline } from '@/site/blog/Inline';
import '@/site/blog/blog.css';

/**
 * Статья блога — макет «SeoMarket Блог статья.dc.html».
 *
 * Заголовок и описание у статьи свои, поэтому PageSeo здесь с выражениями. Пререндер пропускает
 * адреса с параметром (/blog/:slug), а статьи пишет отдельно из src/site/blog/articles-meta.json —
 * см. конец scripts/prerender.cjs.
 *
 * Из макета убрано: «Данные: 214 проверок аудита mebel-grad.ru», замеры «4,6 с → 2,2 с» и вклад
 * каждой причины в секундах, «аудит измеряет LCP, INP и CLS на каждой странице» — сервис этого не делает.
 */

const MUTED68 = 'color-mix(in srgb,var(--color-text) 68%,transparent)';
const FAQ_ID = 'voprosy';

/** Подсветка текущего раздела в оглавлении: верхний из разделов, чей заголовок уже прокручен. */
function useActiveSection(ids: string[]): string | undefined {
  const [active, setActive] = useState<string | undefined>(ids[0]);
  const key = ids.join('|');
  useEffect(() => {
    const onScroll = () => {
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        // 120px — высота липкой шапки с запасом: раздел считается открытым, когда его заголовок под ней.
        if (el && el.getBoundingClientRect().top <= 120) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return active;
}

const NotFoundState: React.FC = () => (
  <SiteLayout>
    <PageSeo title="Статья не найдена" description="Такой статьи в блоге SeoMarket нет. Список всех статей — на странице блога." noindex />
    <SiteContainer>
      <section style={{ padding: '96px 0 120px', maxWidth: '60ch' }}>
        <span style={{ display: 'block', fontSize: 13, lineHeight: '12px', letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--color-accent-700)', margin: '0 0 14px' }}>
          Блог · 404
        </span>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 'clamp(30px,4.2vw,52px)', lineHeight: 1.08, margin: '0 0 20px' }}>Статья не найдена</h1>
        <p style={{ fontSize: 16, lineHeight: 1.65, margin: '0 0 28px', color: 'color-mix(in srgb,var(--color-text) 80%,transparent)' }}>
          Возможно, адрес набран с ошибкой или статья переехала. Все материалы блога собраны на одной странице.
        </p>
        <Link to="/blog" className="btn btn-primary">
          <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
          Все статьи блога
        </Link>
      </section>
    </SiteContainer>
  </SiteLayout>
);

const ArticleView: React.FC<{ article: Article }> = ({ article }) => {
  const tocIds = [...article.sections.map((s) => s.id), ...(article.faq.length ? [FAQ_ID] : [])];
  const active = useActiveSection(tocIds);
  const related = relatedArticles(article, 3);

  return (
    <SiteLayout>
      <PageSeo title={article.title} description={article.description} image={PHOTOS[article.photo]?.src} />
      <ArticleJsonLd article={article} />
      <SiteContainer>
        <div data-layout style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 240px', gap: 'clamp(32px,5vw,72px)', padding: '56px 0 72px', alignItems: 'start' }}>
          <article style={{ minWidth: 0, maxWidth: '78ch' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2) var(--space-4)', alignItems: 'center', fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)', marginBottom: 16 }}>
              <Link to="/blog" style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                <ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true" />
                Блог
              </Link>
              <span style={{ display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-2) var(--space-4)', color: MUTED68 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                  <Tag size={14} strokeWidth={1.5} aria-hidden="true" />
                  {article.category}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                  <Clock size={14} strokeWidth={1.5} aria-hidden="true" />
                  {article.readMinutes} мин
                </span>
              </span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 'clamp(30px,4.2vw,52px)', lineHeight: 1.08, letterSpacing: '.01em', margin: '0 0 20px', overflowWrap: 'anywhere' }}>
              {article.title}
            </h1>
            <p style={{ fontSize: 17, lineHeight: 1.55, margin: '0 0 24px', color: 'color-mix(in srgb,var(--color-text) 82%,transparent)' }}>{article.lead}</p>
            <div style={{ display: 'flex', gap: 'var(--space-2) var(--space-4)', alignItems: 'center', fontSize: 12.5, color: MUTED68, paddingBottom: 28, borderBottom: '1px solid var(--color-divider)', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                <Calendar size={14} strokeWidth={1.5} aria-hidden="true" />
                <time dateTime={article.date}>{formatArticleDate(article.date)}</time>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                <FileText size={14} strokeWidth={1.5} aria-hidden="true" />
                Редакция SeoMarket
              </span>
            </div>

            <figure style={{ margin: '32px 0 8px' }}>
              <SitePhoto id={article.photo} aspect="16/9" eager />
            </figure>

            <ArticleSections sections={article.sections} />

            {/* Призыв перед вопросами, как в макете: к этому месту читатель уже понял, что проверять. */}
            <div className="blueprint" style={{ padding: 'var(--space-6)', display: 'grid', gap: 'var(--space-3)', margin: '40px 0 36px' }}>
              <i className="corner tl" />
              <i className="corner tr" />
              <i className="corner bl" />
              <i className="corner br" />
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, lineHeight: 1.2, margin: 0 }}>Проверьте свой сайт</h2>
              <p style={{ fontSize: 14.5, lineHeight: 1.55, margin: 0, maxWidth: '56ch', color: 'color-mix(in srgb,var(--color-text) 78%,transparent)' }}>
                Аудит обходит сайт и показывает ошибки с адресами страниц: мета-теги, canonical, коды ответа, редиректы, время ответа сервера. Проверка бесплатная, платите только за правки, которые выберете в смете.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginTop: 'var(--space-2)' }}>
                <Link to="/#audit" className="btn btn-primary">
                  Проверить сайт
                  <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
                </Link>
                <Link to="/#ceny" className="btn btn-secondary">
                  Сколько стоят правки
                  <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
                </Link>
              </div>
            </div>

            {article.faq.length > 0 && (
              <section aria-labelledby={FAQ_ID}>
                <h2 id={FAQ_ID} style={{ fontFamily: 'var(--font-heading)', fontSize: 28, lineHeight: 1.15, margin: '44px 0 16px', scrollMarginTop: 88 }}>
                  Частые вопросы
                </h2>
                <div style={{ borderTop: '1px solid var(--color-divider)', marginBottom: 8 }}>
                  {article.faq.map((f) => (
                    <div key={f.q} style={{ padding: '16px 0', borderBottom: '1px solid var(--color-divider)' }}>
                      <h3 style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 'inherit', lineHeight: 1.3, margin: '0 0 6px' }}>
                        <CircleHelp size={18} strokeWidth={1.5} aria-hidden="true" style={{ flex: 'none', marginTop: 2, color: 'var(--color-accent)' }} />
                        <span>{f.q}</span>
                      </h3>
                      <p style={{ fontSize: 14.5, lineHeight: 1.6, margin: 0, color: 'color-mix(in srgb,var(--color-text) 78%,transparent)' }}>
                        <Inline text={f.a} />
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </article>

          <aside data-aside style={{ position: 'sticky', top: 88, display: 'grid', gap: 'var(--space-6)', minWidth: 0 }}>
            <nav data-toc aria-label="Оглавление статьи" style={{ border: '1px solid var(--color-divider)', padding: 'var(--space-4)' }}>
              <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: MUTED68, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <List size={14} strokeWidth={1.5} aria-hidden="true" />
                В статье
              </div>
              {article.sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} aria-current={active === s.id ? 'true' : undefined}>
                  {s.toc ?? s.title}
                </a>
              ))}
              {article.faq.length > 0 && (
                <a href={`#${FAQ_ID}`} aria-current={active === FAQ_ID ? 'true' : undefined}>
                  Частые вопросы
                </a>
              )}
            </nav>
            <div className="blueprint" style={{ padding: 'var(--space-4)', display: 'grid', gap: 8 }}>
              <i className="corner tl" />
              <i className="corner tr" />
              <i className="corner bl" />
              <i className="corner br" />
              <div style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--color-accent-700)' }}>Бесплатно</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 19, lineHeight: 1.2 }}>Технический аудит с адресами страниц</div>
              <Link to="/#audit" className="btn btn-primary btn-block" style={{ marginTop: 4 }}>
                Проверить сайт
                <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>

        <section style={{ padding: '0 0 72px' }}>
          <ArticleRail exclude={article.slug} />
        </section>

        {/* «Читайте также» — только статьи, которые есть в блоге: карточка на несуществующий
            материал была бы битой ссылкой, о которых блог сам и пишет. */}
        <section style={{ padding: '0 0 72px' }} aria-label="Читайте также">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-6)', flexWrap: 'wrap', marginBottom: 12 }}>
            <span style={{ display: 'block', fontSize: 13, lineHeight: '12px', letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--color-accent-700)' }}>
              Читайте также
            </span>
            <Link to="/blog" style={{ fontSize: 13 }}>
              Все статьи →
            </Link>
          </div>
          <hr style={{ height: 1, border: 0, margin: '0 0 32px', background: 'var(--color-divider)' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(290px,100%),1fr))', gap: 'clamp(20px,2.5vw,32px)' }}>
            {related.map((a) => (
              <Link
                key={a.slug}
                to={`/blog/${a.slug}`}
                data-post
                className="blueprint"
                style={{ padding: 'var(--space-6)', textDecoration: 'none', color: 'inherit', display: 'grid', gap: 10, alignContent: 'start' }}
              >
                <i className="corner tl" />
                <i className="corner tr" />
                <i className="corner bl" />
                <i className="corner br" />
                <span style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1) var(--space-3)', alignItems: 'center', fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--color-accent-700)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                    <Tag size={14} strokeWidth={1.5} aria-hidden="true" />
                    {a.category}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', color: MUTED68 }}>
                    <Clock size={14} strokeWidth={1.5} aria-hidden="true" />
                    {a.readMinutes} мин
                  </span>
                </span>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 21, lineHeight: 1.2, margin: 0, transition: 'color .15s ease' }}>{a.title}</h3>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 12, color: MUTED68 }}>
                  <Calendar size={14} strokeWidth={1.5} aria-hidden="true" />
                  <time dateTime={a.date}>{formatArticleDate(a.date)}</time>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </SiteContainer>
    </SiteLayout>
  );
};

const BlogArticle: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = getArticle(slug);
  if (!article) return <NotFoundState />;
  // key: при переходе на другую статью из «Читайте также» оглавление и его подсветка пересоздаются.
  return <ArticleView key={article.slug} article={article} />;
};

export default BlogArticle;
