
import { toast } from '@/hooks/use-toast';
import { normalizeHost } from '@/modules/audit/utils/auditLinks';

/**
 * Выгрузки со страницы результатов аудита.
 *
 * Раньше весь хук был заглушкой из console.log: «Экспорт JSON» на /site-audit
 * ничего не скачивал и ничего не сообщал. Экспорт теперь настоящий; то, чего
 * на сервере нет (сборка исправленной копии сайта), честно об этом говорит.
 */
export const useAuditExports = (url: string) => {
  const downloadSitemap = () => {
    // Sitemap скачивается через ScanContext (downloadSitemap), этот вариант не используется.
    return Promise.resolve();
  };

  const downloadOptimizedSite = async () => {
    toast({
      title: 'Скачивание пока недоступно',
      description: 'Сборка исправленной копии сайта на сервере ещё не реализована.',
    });
  };

  const exportJSONData = (auditData: any) => {
    if (!auditData) {
      toast({
        title: 'Нечего выгружать',
        description: 'Результаты аудита ещё не загрузились.',
        variant: 'destructive',
      });
      return Promise.resolve();
    }

    const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const host = normalizeHost(url) || 'site';
    const date = new Date().toISOString().slice(0, 10);
    link.href = objectUrl;
    link.download = `seo-audit-${host}-${date}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);

    toast({
      title: 'Отчёт выгружен',
      description: 'JSON-файл с результатами аудита сохранён',
    });
    return Promise.resolve();
  };

  /**
   * Не запускает оптимизацию и не сообщает об успехе. Настоящий запуск — кнопка
   * в блоке оптимизации (AuditOptimizationSection, runOptimization); раньше
   * здесь был console.log с ответом «успешно».
   */
  const optimizeSiteContent = async (_contentPrompt: string) => false;

  return {
    downloadSitemap,
    downloadOptimizedSite,
    exportJSONData,
    optimizeSiteContent
  };
};
