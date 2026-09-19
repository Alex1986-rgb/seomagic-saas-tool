import React from 'react';
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

interface BreadcrumbsWrapperProps {
  items: BreadcrumbItem[];
  className?: string;
}

const HOME_CRUMB: BreadcrumbItem = { name: 'Главная', url: '/' };

export const BreadcrumbsWrapper: React.FC<BreadcrumbsWrapperProps> = ({ items, className }) => {
  // Видимые крошки рисуют «домик» сами, поэтому страницы передают список без
  // главной. Разметка BreadcrumbList при этом начиналась с текущего раздела —
  // поисковик видел цепочку без корня сайта. В разметку главная добавляется,
  // если её нет в начале списка; видимые крошки не меняются.
  const schemaItems = items[0]?.url === '/' ? items : [HOME_CRUMB, ...items];

  return (
    <>
      <BreadcrumbSchema items={schemaItems} />
      <Breadcrumbs items={items} className={className} />
    </>
  );
};
