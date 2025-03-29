
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export interface FeatureData {
  icon: LucideIcon;
  title: string;
  description: string;
  link?: string;
  category: string;
  content?: string; // Содержимое для детальной страницы
  benefits?: string[]; // Преимущества для детальной страницы
  imageUrl?: string; // URL изображения для детальной страницы
}

export interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  link?: string;
}

export interface FeatureCategoryProps {
  title: string;
  features: FeatureCardProps[];
}

export interface FeatureGridProps {
  features: FeatureCardProps[];
}

export interface FeaturePageProps {
  title: string;
  description: string;
  icon?: ReactNode;
  category?: string;
  content?: string;
  benefits?: string[];
  imageUrl?: string;
  relatedFeatures?: FeatureData[];
}
