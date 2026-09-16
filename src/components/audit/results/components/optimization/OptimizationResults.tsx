
import React from 'react';

interface DemoPage {
  title: string;
  content: string;
  meta?: {
    description?: string;
    keywords?: string;
  };
  optimized?: {
    content: string;
    meta?: {
      description?: string;
      keywords?: string;
    };
  };
}

interface OptimizationResultsProps {
  url?: string;
  optimizationResult?: {
    beforeScore: number;
    /** Пусто, пока не сделан повторный аудит: новую оценку даёт он, а не мы. */
    afterScore?: number | null;
    demoPage?: DemoPage;
    /** Что на самом деле переписано. */
    pages?: Array<{ url: string; recommendations: string }>;
    failures?: Array<{ url: string; error: string }>;
    cost?: number;
    status?: 'completed' | 'partial' | 'failed';
  } | null;
  onDownloadOptimized?: () => void;
  onGeneratePdfReport?: () => void;
  className?: string;

  // Legacy props for backwards compatibility - все обязательные для совместимости
  beforeTitle?: string;
  afterTitle?: string;
  beforeContent?: string;
  afterContent?: string;
  beforeMeta?: { description?: string; keywords?: string };
  afterMeta?: { description?: string; keywords?: string };
  beforeScore?: number;
  afterScore?: number;
}

const OptimizationResults: React.FC<OptimizationResultsProps> = ({
  url,
  optimizationResult,
  onDownloadOptimized,
  onGeneratePdfReport,
  className,
  // Legacy props
  beforeTitle,
  afterTitle,
  beforeContent,
  afterContent,
  beforeMeta,
  afterMeta,
  beforeScore,
  afterScore
}) => {
  // Проверяем есть ли legacy props и строим optimizationResult из них
  let finalOptimizationResult = optimizationResult;
  
  if (beforeScore !== undefined && afterScore !== undefined) {
    finalOptimizationResult = {
      beforeScore,
      afterScore,
      demoPage: {
        title: beforeTitle || "",
        content: beforeContent || "",
        meta: beforeMeta,
        optimized: {
          content: afterContent || "",
          meta: afterMeta,
        },
      }
    };
  }

  if (!finalOptimizationResult) return null;

  const {
    beforeScore: finalBeforeScore,
    afterScore: finalAfterScore,
    demoPage,
    pages,
    failures,
    cost,
    status,
  } = finalOptimizationResult;

  // Новую оценку показываем, только если она измерена повторным аудитом.
  // Раньше здесь всегда стояло «стало 92» и «+27 баллов» — цифры из кода, а не
  // с сайта.
  const hasMeasuredAfter = typeof finalAfterScore === 'number';

  return (
    <div className={`border border-green-500/20 rounded-lg p-4 bg-green-50/10 ${className || ''}`}>
      <h4 className="font-semibold text-green-700 mb-2">
        {status === 'partial' ? 'Оптимизация прошла частично' : 'Оптимизация завершена'}
      </h4>

      <div className="flex flex-wrap gap-8 mb-4">
        <div>
          <p className="text-sm text-muted-foreground">Оценка по аудиту</p>
          <p className="text-xl font-semibold">{finalBeforeScore}/100</p>
        </div>
        {hasMeasuredAfter ? (
          <div>
            <p className="text-sm text-muted-foreground">После повторного аудита</p>
            <p className="text-xl font-semibold text-green-600">{finalAfterScore}/100</p>
          </div>
        ) : (
          <div className="max-w-sm">
            <p className="text-sm text-muted-foreground">Новая оценка</p>
            <p className="text-sm">Появится после повторного аудита — он измерит сайт заново.</p>
          </div>
        )}
        {typeof pages?.length === 'number' && (
          <div>
            <p className="text-sm text-muted-foreground">Переписано страниц</p>
            <p className="text-xl font-semibold">{pages.length}</p>
          </div>
        )}
        {typeof cost === 'number' && cost > 0 && (
          <div>
            <p className="text-sm text-muted-foreground">Расход на модель</p>
            <p className="text-xl font-semibold">{cost.toFixed(2)} ₽</p>
          </div>
        )}
      </div>

      {failures && failures.length > 0 && (
        <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm dark:border-amber-900 dark:bg-amber-950/40">
          <p className="font-medium">Не удалось переписать: {failures.length}</p>
          <ul className="mt-1 list-disc pl-5 text-muted-foreground">
            {failures.slice(0, 5).map((failure) => (
              <li key={failure.url}>{failure.url} — {failure.error}</li>
            ))}
          </ul>
        </div>
      )}

      {pages && pages.length > 0 && (
        <div className="mb-4 max-h-64 overflow-auto rounded-md border bg-background p-3 text-sm">
          <p className="mb-2 font-semibold">Что переписано</p>
          <ul className="space-y-2">
            {pages.slice(0, 20).map((page) => (
              <li key={page.url}>
                <p className="font-medium break-all">{page.url}</p>
                <p className="line-clamp-2 text-muted-foreground">{page.recommendations}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {demoPage && (
        <div className="mb-4 p-3 bg-background border rounded-md text-sm">
          <p className="font-semibold">{demoPage.title} - пример оптимизации:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div>
              <p className="text-xs text-muted-foreground">До оптимизации:</p>
              <p className="line-clamp-3">{demoPage.content}</p>
            </div>
            <div>
              <p className="text-xs text-green-600">После оптимизации:</p>
              <p className="line-clamp-3">{demoPage.optimized?.content}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mt-4">
        <button 
          onClick={onDownloadOptimized}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
        >
          Скачать оптимизированный сайт
        </button>
        <button 
          onClick={onGeneratePdfReport}
          className="border border-primary px-4 py-2 rounded hover:bg-primary/10"
        >
          Скачать PDF-отчет
        </button>
      </div>
    </div>
  );
};

export default OptimizationResults;
