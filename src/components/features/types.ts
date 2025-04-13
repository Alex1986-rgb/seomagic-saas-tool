
import { ReactNode } from 'react';

export interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
  link?: string;
  category?: string;
}

export interface FeatureGridProps {
  features: Feature[];
}

export interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  link?: string;
  layoutId?: string;
}

export interface FeatureCategoryProps {
  title?: string;
  features: Feature[];
}
