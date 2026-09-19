/**
 * Дата статьи для людей: «15 мая 2025 г.» вместо «2025-05-15».
 *
 * В данных статей дата лежит строкой ISO, и страница выводила её как есть.
 * Строка вида «2025-05-15» разбирается как полночь по UTC, поэтому и
 * форматируем по UTC — иначе в часовых поясах западнее Гринвича дата
 * съезжала бы на день назад. Неразборчивую строку возвращаем без изменений.
 */
export function formatPostDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
