/**
 * Контакты сервиса в одном месте.
 *
 * По коду были разбросаны придуманные данные: телефон +7 800 123-45-67, адрес
 * «ул. Примерная, д. 123», почта info@seomarket.ru, страницы во «ВКонтакте» и
 * телеграме, которых нет. Всё это уходило в разметку для поисковых систем —
 * то есть мы показывали Яндексу и Google несуществующую организацию.
 *
 * Здесь остаётся только то, что верно. Пустое поле означает «данных нет»: тогда
 * разметка его не выводит, а не подставляет выдумку. Впишите настоящие
 * значения — они появятся и в разметке, и на страницах контактов.
 */

export interface SiteContacts {
  email: string;
  salesEmail: string;
  telephone: string;
  /** Улица, дом, офис — если есть офис, куда можно приехать. */
  streetAddress: string;
  addressLocality: string;
  addressCountry: string;
  geo: { latitude: number; longitude: number } | null;
  /** Страницы в соцсетях — только существующие. */
  social: string[];
}

export const SITE_CONTACTS: SiteContacts = {
  email: '',
  salesEmail: '',
  telephone: '',
  streetAddress: '',
  addressLocality: '',
  addressCountry: 'RU',
  geo: null,
  social: [],
};

/** Есть ли у нас адрес, который можно показывать. */
export const hasPostalAddress = (): boolean =>
  Boolean(SITE_CONTACTS.streetAddress && SITE_CONTACTS.addressLocality);

/** Собирает объект, выбрасывая пустые поля: в разметку не должно попасть пустое. */
export function withoutEmpty<T extends Record<string, unknown>>(source: T): Partial<T> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(source)) {
    if (value === null || value === undefined || value === '') continue;
    if (Array.isArray(value) && value.length === 0) continue;
    result[key] = value;
  }
  return result as Partial<T>;
}

/**
 * Реквизиты юрлица (или ИП) для страницы «Контакты и реквизиты» и документов.
 *
 * В макете стояли заглушки — ИНН 7712345678, счёт из нулей, «[ФИО]». Показывать их нельзя:
 * поисковики и платёжные провайдеры сверяют реквизиты на сайте с договором, а клиент
 * по выдуманному ИНН не найдёт организацию. Пока юрлицо не зарегистрировано, все поля
 * пустые, и страница вместо таблицы говорит честно: договор не заключается, оплата не
 * принимается. Заполнили поле — строка появится сама; пустые строки не выводятся.
 */
export interface SiteLegal {
  /** Полное наименование: «Общество с ограниченной ответственностью „…“» или «ИП …». */
  legalName: string;
  inn: string;
  /** ОГРН для организации. */
  ogrn: string;
  /** ОГРНИП для индивидуального предпринимателя. */
  ogrnip: string;
  legalAddress: string;
  bankName: string;
  bik: string;
  /** Расчётный счёт. */
  account: string;
  /** Корреспондентский счёт банка. */
  corrAccount: string;
}

export const SITE_LEGAL: SiteLegal = {
  legalName: '',
  inn: '',
  ogrn: '',
  ogrnip: '',
  legalAddress: '',
  bankName: '',
  bik: '',
  account: '',
  corrAccount: '',
};

/** Опубликованы ли реквизиты: без наименования и ИНН таблица не имеет смысла. */
export const hasLegalDetails = (): boolean => Boolean(SITE_LEGAL.legalName && SITE_LEGAL.inn);
