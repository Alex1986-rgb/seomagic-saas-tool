
import { v4 as uuidv4 } from 'uuid';

// Простая утилита для генерации уникальных идентификаторов
export const generateId = (): string => {
  return uuidv4();
};

// Функция для нормализации URL
export const normalizeUrl = (url: string): string => {
  if (!url) return '';
  return url.startsWith('http') ? url : `https://${url}`;
};

// Функция для извлечения домена из URL
export const extractDomain = (url: string): string => {
  try {
    if (!url) return '';
    const normalizedUrl = normalizeUrl(url);
    return new URL(normalizedUrl).hostname;
  } catch (error) {
    console.error('Error extracting domain:', error);
    return url;
  }
};

// Функция для форматирования даты
export const formatDate = (date: string | Date): string => {
  try {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};
