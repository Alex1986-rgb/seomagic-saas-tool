
export type CrawlStage = 'idle' | 'starting' | 'crawling' | 'analyzing' | 'completed' | 'error';

export const getStageTitleAndInfo = (
  stage: CrawlStage,
  error: string | null,
  pagesScanned: number
): { title: string; info: string } => {
  switch (stage) {
    case 'idle':
      return {
        title: 'Глубокое сканирование',
        info: 'Подготовка к сканированию сайта...'
      };
    case 'starting':
      return {
        title: 'Сканирование запущено',
        info: 'Инициализация сканера и проверка доступности сайта...'
      };
    case 'crawling':
      return {
        title: 'Сканирование в процессе',
        info: 'Обнаружение и анализ страниц. Это может занять некоторое время в зависимости от размера сайта.'
      };
    case 'analyzing':
      return {
        title: 'Анализ данных',
        info: 'Обработка собранных данных и формирование отчета...'
      };
    case 'completed':
      return {
        title: 'Сканирование завершено',
        info: `Успешно просканировано ${pagesScanned.toLocaleString('ru-RU')} страниц. Вы можете скачать карту сайта или полный отчет.`
      };
    case 'error':
      return {
        title: 'Ошибка сканирования',
        info: error || 'Произошла ошибка при сканировании сайта. Пожалуйста, попробуйте еще раз.'
      };
    default:
      return {
        title: 'Глубокое сканирование',
        info: 'Подготовка к сканированию сайта...'
      };
  }
};
