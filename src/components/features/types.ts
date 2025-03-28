
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export interface FeatureItemProps {
  icon: ReactNode;
  title: string;
  description: string;
  link?: string;
  category?: string;
}

export interface FeatureCategoryProps {
  title: string;
  features: FeatureItemProps[];
}

export interface FeatureCardProps extends FeatureItemProps {}

export interface FeatureData {
  icon: LucideIcon;
  title: string;
  description: string;
  link?: string;
  category?: string;
}
