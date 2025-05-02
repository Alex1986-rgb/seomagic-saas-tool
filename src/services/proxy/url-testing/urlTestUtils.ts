
/**
 * Helper utilities for URL testing
 */

/**
 * Determines if an HTTP status code indicates success
 */
export function isSuccessStatus(status: number): boolean {
  return status >= 200 && status < 400;
}

/**
 * Converts HTTP status code to a human-readable description
 */
export function getStatusDescription(status: number): string {
  if (status >= 200 && status < 300) return 'Успешно';
  if (status >= 300 && status < 400) return 'Перенаправление';
  if (status === 408) return 'Таймаут';
  if (status >= 400 && status < 500) return 'Ошибка клиента';
  if (status >= 500) return 'Ошибка сервера';
  return 'Неизвестный статус';
}

/**
 * Formats an error into a readable error detail
 */
export function formatErrorDetail(error: any): string {
  if (error.code === 'ECONNABORTED') return 'Превышено время ожидания';
  if (error.code === 'ECONNREFUSED') return 'Соединение отклонено';
  if (error.code === 'ENOTFOUND') return 'Не найден хост';
  return error.message || 'Неизвестная ошибка';
}
