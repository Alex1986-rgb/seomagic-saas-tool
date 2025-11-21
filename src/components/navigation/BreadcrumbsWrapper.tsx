import React from 'react';
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

interface BreadcrumbsWrapperProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const BreadcrumbsWrapper: React.FC<BreadcrumbsWrapperProps> = ({ items, className }) => {
  return (
    <>
      <BreadcrumbSchema items={items} />
      <Breadcrumbs items={items} className={className} />
    </>
  );
};
