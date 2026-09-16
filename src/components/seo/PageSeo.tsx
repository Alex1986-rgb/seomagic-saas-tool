import React from 'react';
import { Helmet } from 'react-helmet-async';
import { absoluteAssetUrl } from '@/lib/asset-url';

/**
 * Заголовок и описание отдельной страницы.
 *
 * До этого на весь сайт работал один `DefaultSEO`: все 45 страниц отдавали
 * одинаковые title «SEO Аудит и Оптимизация» и одинаковое описание. Поисковые
 * системы считают такие страницы дублями и показывают в выдаче одну — то есть
 * сервис, который ищет у клиентов повторяющиеся заголовки, страдал ровно тем
 * же. Компонент ставится на страницу и задаёт её собственные заголовок,
 * описание и canonical.
 */

interface PageSeoProps {
  /** Без названия сервиса: оно добавляется автоматически. */
  title: string;
  description: string;
  /** Страницы кабинета и админки в поиске не нужны. */
  noindex?: boolean;
  /** Своя картинка для ссылки в соцсетях. */
  image?: string;
}

const SITE_NAME = 'SeoMarket';

export const PageSeo: React.FC<PageSeoProps> = ({ title, description, noindex, image }) => {
  const url = typeof window !== 'undefined' ? window.location.href.split('#')[0] : '';
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;
  // Соцсети читают og:image в отрыве от страницы — нужен полный адрес
  // с учётом подпапки публикации.
  const picture = absoluteAssetUrl(image ?? '/og-image.jpg');

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {url && <link rel="canonical" href={url} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content="website" />
      <meta property="og:locale" content="ru_RU" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={picture} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={picture} />
    </Helmet>
  );
};

export default PageSeo;
