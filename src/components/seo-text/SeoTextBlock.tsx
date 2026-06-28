import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * SEO-блок для низа страницы: вступительный абзац + раскрытие полного текста с
 * таблицами и перелинковкой, плюс блок частозадаваемых вопросов (FAQ) и
 * FAQPage-разметка (JSON-LD) для расширенных сниппетов в поиске.
 */

export interface FaqItem { q: string; a: string }
export interface RelatedLink { href: string; label: string }

export interface SeoTextData {
  heading?: string;
  intro: string;
  bodyHtml: string;            // полный SEO-текст в HTML (с внутренними ссылками)
  faqs?: FaqItem[];            // частозадаваемые вопросы по теме страницы
  relatedLinks?: RelatedLink[]; // перелинковка на смежные разделы
}

interface Props {
  data: SeoTextData;
  defaultOpen?: boolean;
}

const SeoTextBlock: React.FC<Props> = ({ data, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const faqs = data.faqs || [];

  return (
    <section className="seo-text-block mt-12 border-t border-border pt-8">
      {/* FAQPage-разметка для поисковиков */}
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            }),
          }}
        />
      )}

      {data.heading && <h2 className="text-xl font-semibold mb-3">{data.heading}</h2>}

      <p className="text-muted-foreground leading-relaxed">{data.intro}</p>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        {open ? 'Свернуть' : 'Читать полностью'}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <div className={`grid transition-all duration-300 ease-in-out ${open ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div
            className="seo-prose max-w-none text-muted-foreground leading-relaxed [&_a]:text-primary [&_a]:underline [&_h3]:text-foreground [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_table]:w-full [&_table]:my-4 [&_table]:border-collapse [&_th]:bg-muted [&_th]:text-foreground [&_th]:text-left [&_th]:p-2 [&_th]:border [&_th]:border-border [&_td]:p-2 [&_td]:border [&_td]:border-border"
            dangerouslySetInnerHTML={{ __html: data.bodyHtml }}
          />

          {/* Перелинковка на смежные разделы */}
          {data.relatedLinks && data.relatedLinks.length > 0 && (
            <div className="mt-6">
              <h3 className="text-foreground font-semibold mb-2">Смотрите также</h3>
              <ul className="flex flex-wrap gap-x-5 gap-y-1 list-disc pl-5 text-sm">
                {data.relatedLinks.map((l) => (
                  <li key={l.href}><Link to={l.href} className="text-primary hover:underline">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* FAQ — частозадаваемые вопросы, по 4 в блоке */}
      {faqs.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Частые вопросы</h3>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
            {faqs.slice(0, 8).map((f, i) => (
              <details key={i} className="border-b border-border py-2 group">
                <summary className="cursor-pointer font-medium text-foreground list-none flex justify-between items-center gap-2">
                  {f.q}
                  <ChevronDown className="h-4 w-4 flex-none text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default SeoTextBlock;
