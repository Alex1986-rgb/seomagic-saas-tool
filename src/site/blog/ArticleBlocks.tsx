import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { ArticleBlock, ArticleSection } from './types';
import { Inline } from './Inline';

/**
 * Блоки текста статьи — стили из макета «SeoMarket Блог статья.dc.html» (строки 69–146).
 * Одна функция на тип блока: так все 11 статей выглядят одинаково, а новый тип добавляется в одном месте.
 */

const SOFT = 'color-mix(in srgb,var(--color-text) 78%,transparent)';

const Table: React.FC<{ block: Extract<ArticleBlock, { type: 'table' }> }> = ({ block }) => {
  const right = new Set(block.alignRight ?? []);
  return (
    <div style={{ margin: '28px 0' }}>
      <p style={{ textAlign: 'center', fontSize: 15, margin: '0 0 12px', color: SOFT }}>{block.caption}</p>
      {/* Прокрутка внутри рамки, а не всей страницы: на 375px таблица шире экрана. */}
      <div style={{ overflowX: 'auto', border: '1px solid var(--color-divider)' }} tabIndex={0} role="region" aria-label={block.caption}>
        <table className="table" style={{ minWidth: block.minWidth ?? 600 }}>
          <thead>
            <tr>
              {block.head.map((h, i) => (
                <th key={i} scope="col" style={{ paddingLeft: i === 0 ? 20 : undefined, textAlign: right.has(i) ? 'right' : undefined }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, r) => {
              const hl = block.highlight === r;
              return (
                <tr key={r} data-hl={hl ? '' : undefined}>
                  {row.map((cell, c) => (
                    <td
                      key={c}
                      style={{
                        paddingLeft: c === 0 ? 20 : undefined,
                        fontSize: c === 0 ? 15 : 14,
                        fontWeight: c === 0 && hl ? 600 : undefined,
                        textAlign: right.has(c) ? 'right' : undefined,
                        whiteSpace: right.has(c) ? 'nowrap' : undefined,
                      }}
                    >
                      <Inline text={cell} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {block.note && (
        <p style={{ fontSize: 13, lineHeight: 1.6, margin: '14px 0 0', color: 'color-mix(in srgb,var(--color-text) 70%,transparent)' }}>
          <Inline text={block.note} />
        </p>
      )}
    </div>
  );
};

const Block: React.FC<{ block: ArticleBlock }> = ({ block }) => {
  switch (block.type) {
    case 'paragraph':
      return (
        <p style={{ fontSize: 16, lineHeight: 1.65, margin: '0 0 16px' }}>
          <Inline text={block.text} />
        </p>
      );
    case 'list':
      return block.ordered ? (
        <ol style={{ margin: '0 0 24px', padding: '0 0 0 24px', fontSize: 16, lineHeight: 1.7 }}>
          {block.items.map((item, i) => (
            <li key={i} style={{ marginBottom: 10, paddingLeft: 4 }}>
              <Inline text={item} />
            </li>
          ))}
        </ol>
      ) : (
        <ul style={{ margin: '0 0 24px', padding: 0, listStyle: 'none', fontSize: 16, lineHeight: 1.7 }}>
          {block.items.map((item, i) => (
            <li key={i} style={{ marginBottom: 10, display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
              <ChevronRight size={16} strokeWidth={1.5} aria-hidden="true" style={{ flex: 'none', marginTop: 5, color: 'var(--color-accent)' }} />
              <span style={{ minWidth: 0 }}>
                <Inline text={item} />
              </span>
            </li>
          ))}
        </ul>
      );
    case 'table':
      return <Table block={block} />;
    case 'callout':
      return (
        <div className="blueprint" style={{ padding: 'var(--space-6)', display: 'grid', gap: 'var(--space-3)', margin: '8px 0 28px' }}>
          <i className="corner tl" />
          <i className="corner tr" />
          <i className="corner bl" />
          <i className="corner br" />
          {block.title && <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, lineHeight: 1.2, margin: 0 }}>{block.title}</h3>}
          <p style={{ fontSize: 14.5, lineHeight: 1.6, margin: 0, color: SOFT }}>
            <Inline text={block.text} />
          </p>
        </div>
      );
    case 'code':
      return (
        <figure style={{ margin: '8px 0 28px' }}>
          {block.caption && (
            <figcaption style={{ fontSize: 13, margin: '0 0 8px', color: 'color-mix(in srgb,var(--color-text) 70%,transparent)' }}>{block.caption}</figcaption>
          )}
          <pre
            tabIndex={0}
            style={{
              margin: 0,
              padding: 'var(--space-4)',
              border: '1px solid var(--color-divider)',
              background: 'color-mix(in srgb,var(--color-text) 4%,transparent)',
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              lineHeight: 1.6,
              overflowX: 'auto',
              whiteSpace: 'pre',
            }}
          >
            <code>{block.text}</code>
          </pre>
        </figure>
      );
    case 'figure':
      return (
        <figure style={{ margin: '32px 0 28px' }}>
          <div className="blueprint" style={{ position: 'relative', padding: 0 }}>
            <i className="corner tl" />
            <i className="corner tr" />
            <i className="corner bl" />
            <i className="corner br" />
            {/* Схемы лежат в public/images/blog: путь собираем от BASE_URL — сайт публикуется в подпапке. */}
            <img
              src={`${import.meta.env.BASE_URL}${block.src}`}
              alt={block.alt}
              loading="lazy"
              decoding="async"
              width={1600}
              height={900}
              style={{ display: 'block', width: '100%', height: 'auto', aspectRatio: '16/9' }}
            />
          </div>
          <figcaption style={{ fontSize: 12.5, color: 'color-mix(in srgb,var(--color-text) 68%,transparent)', marginTop: 10 }}>{block.caption}</figcaption>
        </figure>
      );
  }
};

export const ArticleSections: React.FC<{ sections: ArticleSection[] }> = ({ sections }) => (
  <>
    {sections.map((s) => (
      <section key={s.id} aria-labelledby={s.id}>
        <h2 id={s.id} style={{ fontFamily: 'var(--font-heading)', fontSize: 28, lineHeight: 1.15, margin: '44px 0 16px', scrollMarginTop: 88 }}>
          {s.title}
        </h2>
        {s.blocks.map((b, i) => (
          <Block key={i} block={b} />
        ))}
      </section>
    ))}
  </>
);
