
import { PositionData } from './positionTracker';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Экспорт результатов проверки позиций в Excel
export const exportToExcel = (data: PositionData, filename: string) => {
  try {
    // Подготавливаем данные для Excel
    const worksheetData = data.keywords.map(item => ({
      'Ключевое слово': item.keyword,
      'Поисковая система': 
        item.searchEngine === 'google' ? 'Google' : 
        item.searchEngine === 'yandex' ? 'Яндекс' : 
        item.searchEngine === 'mailru' ? 'Mail.ru' : item.searchEngine,
      'Позиция': item.position > 0 ? item.position : 'Не найдено',
      'URL': item.url || 'Н/Д',
      'ТОП-10': item.position > 0 && item.position <= 10 ? 'Да' : 'Нет',
      'ТОП-30': item.position > 0 && item.position <= 30 ? 'Да' : 'Нет'
    }));
    
    // Создаем рабочую книгу и лист
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Позиции');
    
    // Добавляем лист с информацией о проверке
    const infoData = [
      { 'Параметр': 'Домен', 'Значение': data.domain },
      { 'Параметр': 'Дата проверки', 'Значение': new Date(data.timestamp).toLocaleString('ru-RU') },
      { 'Параметр': 'Поисковые системы', 'Значение': data.searchEngine === 'all' ? 'Все' : data.searchEngine },
      { 'Параметр': 'Регион', 'Значение': data.region || 'Не указан' },
      { 'Параметр': 'Глубина проверки', 'Значение': data.depth },
      { 'Параметр': 'Количество ключевых слов', 'Значение': data.keywords.length },
      { 'Параметр': 'Найдено в ТОП-10', 'Значение': data.keywords.filter(k => k.position > 0 && k.position <= 10).length },
      { 'Параметр': 'Найдено в ТОП-30', 'Значение': data.keywords.filter(k => k.position > 0 && k.position <= 30).length },
      { 'Параметр': 'Не найдено', 'Значение': data.keywords.filter(k => k.position === 0).length }
    ];
    
    const infoWorksheet = XLSX.utils.json_to_sheet(infoData);
    XLSX.utils.book_append_sheet(workbook, infoWorksheet, 'Информация');
    
    // Сохраняем файл
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${filename}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Ошибка экспорта в Excel:', error);
    throw new Error('Не удалось экспортировать данные в Excel');
  }
};

// Экспорт истории проверок в Excel
export const exportHistoryToExcel = (history: PositionData[], filename: string) => {
  try {
    // Создаем рабочую книгу
    const workbook = XLSX.utils.book_new();
    
    // Лист с общей информацией о проверках
    const summaryData = history.map(item => ({
      'Домен': item.domain,
      'Дата проверки': new Date(item.timestamp).toLocaleString('ru-RU'),
      'Поисковые системы': item.searchEngine === 'all' ? 'Все' : item.searchEngine,
      'Регион': item.region || 'Не указан',
      'Ключевых слов': item.keywords.length,
      'ТОП-10': item.keywords.filter(k => k.position > 0 && k.position <= 10).length,
      'ТОП-30': item.keywords.filter(k => k.position > 0 && k.position <= 30).length,
      'Не найдено': item.keywords.filter(k => k.position === 0).length
    }));
    
    const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Сводка');
    
    // Создаем отдельный лист для каждой проверки
    history.forEach((item, index) => {
      const detailsData = item.keywords.map(keyword => ({
        'Ключевое слово': keyword.keyword,
        'Поисковая система': 
          keyword.searchEngine === 'google' ? 'Google' : 
          keyword.searchEngine === 'yandex' ? 'Яндекс' : 
          keyword.searchEngine === 'mailru' ? 'Mail.ru' : keyword.searchEngine,
        'Позиция': keyword.position > 0 ? keyword.position : 'Не найдено',
        'URL': keyword.url || 'Н/Д',
        'ТОП-10': keyword.position > 0 && keyword.position <= 10 ? 'Да' : 'Нет',
        'ТОП-30': keyword.position > 0 && keyword.position <= 30 ? 'Да' : 'Нет'
      }));
      
      const worksheetName = `Проверка ${index + 1}`;
      const detailsWorksheet = XLSX.utils.json_to_sheet(detailsData);
      XLSX.utils.book_append_sheet(workbook, detailsWorksheet, worksheetName);
    });
    
    // Сохраняем файл
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${filename}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Ошибка экспорта истории в Excel:', error);
    throw new Error('Не удалось экспортировать историю в Excel');
  }
};
