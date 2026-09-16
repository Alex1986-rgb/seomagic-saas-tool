import { isSameSite } from './auditLinks';

/**
 * Проверки, запущенные гостем из этого браузера.
 *
 * Гостевые задачи (user_id IS NULL) политика чтения отдаёт любому посетителю.
 * Поэтому «последняя гостевая проверка сайта» могла оказаться чужой: человек
 * вводил shop.ru и видел результаты или прерванный аудит другого посетителя.
 * Гостю показываем только задачи, номера которых сохранены в его браузере
 * (ключи `task_id_<адрес>`: их пишут страница аудита и запуск проверки).
 */
const TASK_KEY_PREFIX = 'task_id_';

/** Номера гостевых задач этого сайта, известные текущему браузеру. */
export function getBrowserTaskIdsForSite(url: string): string[] {
  if (typeof window === 'undefined') return [];

  const ids = new Set<string>();
  try {
    const storage = window.localStorage;
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (!key || !key.startsWith(TASK_KEY_PREFIX)) continue;

      const storedUrl = key.slice(TASK_KEY_PREFIX.length);
      if (!isSameSite(storedUrl, url)) continue;

      const taskId = storage.getItem(key);
      if (taskId) ids.add(taskId);
    }
  } catch {
    // Хранилище недоступно (приватный режим, запрет сайта) — своих задач не знаем.
    return [];
  }

  return [...ids];
}
