import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * SEO-текстовый блок для низа страницы: видимый вступительный абзац + стрелка,
 * по клику раскрывается полный SEO-текст (≈10000 символов) с таблицами.
 * Контент приходит как HTML (генерируется бэкендом optimization-content).
 */

export interface SeoTextData {
  heading?: string;     // заголовок блока (напр. H2)
  intro: string;        // вступительный абзац (виден всегда)
  bodyHtml: string;     // полный SEO-текст в HTML (абзацы + таблицы)
}

interface Props {
  data: SeoTextData;
  defaultOpen?: boolean;
}

const SeoTextBlock: React.FC<Props> = ({ data, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="seo-text-block mt-12 border-t border-border pt-8">
      {data.heading && (
        <h2 className="text-xl font-semibold mb-3">{data.heading}</h2>
      )}

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

      <div
        className={`grid transition-all duration-300 ease-in-out ${open ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          {/* Полный SEO-текст с таблицами. Стили таблиц — через класс seo-prose. */}
          <div
            className="seo-prose max-w-none text-muted-foreground leading-relaxed [&_h3]:text-foreground [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_table]:w-full [&_table]:my-4 [&_table]:border-collapse [&_th]:bg-muted [&_th]:text-foreground [&_th]:text-left [&_th]:p-2 [&_th]:border [&_th]:border-border [&_td]:p-2 [&_td]:border [&_td]:border-border"
            dangerouslySetInnerHTML={{ __html: data.bodyHtml }}
          />
        </div>
      </div>
    </section>
  );
};

export default SeoTextBlock;
