
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  link?: string;
  category?: string;
}

export interface FeatureData {
  icon: LucideIcon;
  title: string;
  description: string;
  link?: string;
  category?: string;
  content?: string;
  benefits?: string[];
  imageUrl?: string;
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
