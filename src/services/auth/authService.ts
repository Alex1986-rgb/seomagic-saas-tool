
/**
 * Сервис для работы с аутентификацией пользователя
 */

// Типы для аутентификации
export interface AuthUser {
  isLoggedIn: boolean;
  isAdmin: boolean;
}

// Константы для ключей localStorage
const STORAGE_KEYS = {
  IS_LOGGED_IN: 'isLoggedIn',
  IS_ADMIN: 'isAdmin'
};

/**
 * Проверяет, авторизован ли пользователь
 */
export const checkAuthStatus = (): AuthUser => {
  const isLoggedIn = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';
  const isAdmin = localStorage.getItem(STORAGE_KEYS.IS_ADMIN) === 'true';
  
  return {
    isLoggedIn,
    isAdmin
  };
};

/**
 * Вход пользователя с email и паролем
 */
export const loginWithEmailPassword = (email: string, password: string): Promise<void> => {
  // В реальном приложении здесь был бы API запрос
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
      // Уведомляем другие компоненты об изменении состояния
      window.dispatchEvent(new Event('storage'));
      resolve();
    }, 500);
  });
};

/**
 * Вход через Google
 */
export const loginWithGoogle = (): Promise<void> => {
  // В реальном приложении здесь был бы процесс OAuth
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
      // Уведомляем другие компоненты об изменении состояния
      window.dispatchEvent(new Event('storage'));
      resolve();
    }, 1500);
  });
};

/**
 * Регистрация нового пользователя
 */
export const registerUser = (email: string, password: string): Promise<void> => {
  // В реальном приложении здесь был бы API запрос
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

/**
 * Выход пользователя
 */
export const logout = (): void => {
  localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
  localStorage.removeItem(STORAGE_KEYS.IS_ADMIN);
  // Уведомляем другие компоненты об изменении состояния
  window.dispatchEvent(new Event('storage'));
};

/**
 * Переключение статуса администратора (только для демо)
 */
export const toggleAdminStatus = (): void => {
  const isAdmin = localStorage.getItem(STORAGE_KEYS.IS_ADMIN) === 'true';
  localStorage.setItem(STORAGE_KEYS.IS_ADMIN, (!isAdmin).toString());
  // Уведомляем другие компоненты об изменении состояния
  window.dispatchEvent(new Event('storage'));
};
