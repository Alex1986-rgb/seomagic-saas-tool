
interface StageInfo {
  title: string;
  info: string;
}

export function getStageTitleAndInfo(
  crawlStage: string, 
  error: string | null, 
  pagesScanned: number
): StageInfo {
  switch (crawlStage) {
    case 'initializing':
      return {
        title: 'Инициализация сканирования',
        info: 'Подготовка к глубокому сканированию сайта...'
      };
    case 'starting':
      return {
        title: 'Запуск сканирования',
        info: 'Анализ главной страницы и карты сайта...'
      };
    case 'exploring':
      return {
        title: 'Исследование структуры',
        info: 'Анализ основных разделов и каталогов...'
      };
    case 'discovery':
      return {
        title: 'Обнаружение страниц',
        info: 'Поиск всех доступных страниц по ссылкам...'
      };
    case 'indexing':
      return {
        title: 'Индексация контента',
        info: 'Обработка найденных страниц и контента...'
      };
    case 'finalizing':
      return {
        title: 'Завершение сканирования',
        info: 'Сбор итоговой информации и создание карты сайта...'
      };
    case 'completed':
      return {
        title: 'Сканирование завершено',
        info: `Найдено ${pagesScanned.toLocaleString('ru-RU')} страниц на сайте`
      };
    case 'error':
      return {
        title: 'Ошибка сканирования',
        info: error || 'Произошла ошибка при сканировании сайта'
      };
    default:
      return {
        title: 'Сканирование',
        info: 'Обработка сайта...'
      };
  }
}
