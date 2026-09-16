import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SitePhoto } from '@/site/SitePhoto';
import { ARTICLES } from './articles';
import { ArticleMetaLine } from './ArticleMetaLine';
import './blog.css';

/**
 * Карусель «Читать дальше» — макет ArticleRail.dc.html. Стоит под статьёй и на странице отзывов.
 *
 * Атрибут полосы — data-carousel, а не data-rail макета: data-rail в кабинете уже означает сайдбар,
 * и его правила перекрашивали бы карусель.
 */

/** Порядок из макета; остальные статьи добиваются следом, чтобы карусель не пустела при exclude. */
const DEFAULT_ORDER = ['robots', 'dubli', 'plotnost', 'perelinkovka', 'uskorenie-sajta', 'teksty'];
const LIMIT = 6;

export const ArticleRail: React.FC<{
  /** Не показывать эту статью — ту, под которой стоит карусель. */
  exclude?: string;
  title?: string;
}> = ({ exclude, title = 'Читать дальше' }) => {
  const rail = useRef<HTMLDivElement>(null);

  const ordered = [
    ...DEFAULT_ORDER.map((slug) => ARTICLES.find((a) => a.slug === slug)).filter(Boolean),
    ...ARTICLES.filter((a) => !DEFAULT_ORDER.includes(a.slug)),
  ];
  const items = ordered.filter((a) => a.slug !== exclude).slice(0, LIMIT);

  // Прокрутка на ширину видимой области минус нахлёст: следующая карточка остаётся под краем,
  // и видно, что полоса продолжается.
  const step = (dir: number) => {
    const el = rail.current;
    if (!el) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * Math.max(240, el.clientWidth - 80), behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <section style={{ fontFamily: 'var(--font-body)', minWidth: 0 }} aria-label={title}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-6)', flexWrap: 'wrap', marginBottom: 12 }}>
        <span style={{ display: 'block', fontSize: 13, lineHeight: '12px', letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--color-accent-700)' }}>
          {title}
        </span>
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
          <button type="button" className="btn btn-ghost" onClick={() => step(-1)} style={{ padding: '6px 10px' }} aria-label="Предыдущие статьи">
            <ArrowLeft size={18} strokeWidth={1.5} aria-hidden="true" />
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => step(1)} style={{ padding: '6px 10px' }} aria-label="Следующие статьи">
            <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>
      <hr style={{ height: 1, border: 0, margin: '0 0 28px', background: 'var(--color-divider)' }} />

      {/* Отступ сверху — место под уголки рамки-чертежа: overflow-x обрезает всё, что торчит за край. */}
      <div
        data-carousel
        ref={rail}
        style={{ display: 'flex', gap: 'clamp(18px,2.2vw,28px)', overflowX: 'auto', scrollSnapType: 'x mandatory', padding: '6px 6px 16px' }}
      >
        {items.map((a) => (
          <div
            key={a.slug}
            data-railcard
            style={{ flex: '0 0 clamp(260px,30vw,330px)', scrollSnapAlign: 'start', position: 'relative', display: 'grid', gap: 14, alignContent: 'start' }}
          >
            <SitePhoto id={a.railPhoto ?? a.photo} aspect="16/10" />
            <ArticleMetaLine article={a} showDate={false} style={{ letterSpacing: '.06em' }} />
            <span data-railtitle style={{ fontFamily: 'var(--font-heading)', fontSize: 21, lineHeight: 1.2, letterSpacing: '.01em' }}>
              <Link to={`/blog/${a.slug}`} data-stretched>
                {a.title}
              </Link>
            </span>
            <span style={{ fontSize: 13.5, lineHeight: 1.55, color: 'color-mix(in srgb,var(--color-text) 75%,transparent)' }}>{a.summary}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ArticleRail;
