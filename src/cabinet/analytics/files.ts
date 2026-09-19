/**
 * Выгрузка файлов и разбор ответов edge-функций для экранов аналитики кабинета.
 */

/** Текст ошибки функции полезнее общего «Edge Function returned a non-2xx». */
export async function readFunctionError(err: unknown): Promise<string | null> {
  const context = (err as { context?: Response } | null)?.context;
  if (!context || typeof context.json !== 'function') return null;
  try {
    const body = await context.json();
    return typeof body?.error === 'string' ? body.error : null;
  } catch {
    return null;
  }
}

const CONTENT_TYPES: Record<string, string> = {
  json: 'application/json',
  xml: 'application/xml',
  html: 'text/html',
  pdf: 'application/pdf',
  csv: 'text/csv',
};

export function extensionOf(filePath: string | null | undefined): string {
  return ((filePath ?? '').split('.').pop() || '').toLowerCase();
}

/**
 * supabase.functions.invoke сам разбирает ответ по Content-Type: PDF приходит Blob-ом, HTML и
 * XML — строкой, JSON — уже разобранным объектом. Собираем из любого варианта файл.
 */
export function toBlob(data: unknown, extension: string): Blob | null {
  const type = CONTENT_TYPES[extension] ?? 'application/octet-stream';
  if (data instanceof Blob) return data;
  if (typeof data === 'string') return new Blob([data], { type });
  if (data && typeof data === 'object') return new Blob([JSON.stringify(data, null, 2)], { type });
  return null;
}

export function saveBlob(blob: Blob, filename: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Сразу отзывать ссылку нельзя: часть браузеров ещё не начала скачивание.
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

/**
 * CSV для Excel: разделитель «;» (русская локаль Excel не понимает запятую) и BOM, иначе
 * кириллица открывается кракозябрами.
 */
export function downloadCsv(filename: string, header: string[], rows: (string | number | null)[][]): void {
  const cell = (v: string | number | null) => {
    const s = v === null || v === undefined ? '' : String(v);
    return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const text = [header, ...rows].map((r) => r.map(cell).join(';')).join('\r\n');
  saveBlob(new Blob([String.fromCharCode(0xfeff), text], { type: 'text/csv;charset=utf-8' }), filename);
}

export function formatBytes(bytes: number | null | undefined): string {
  if (!bytes) return '—';
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1).replace('.', ',')} МБ`;
  return `${Math.max(1, Math.round(bytes / 1024))} КБ`;
}
