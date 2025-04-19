
import { LucideIcon } from 'lucide-react';

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  link?: string;
}

export interface FeatureCategory {
  title: string;
  features: Feature[];
}

export interface FeatureCategoryProps {
  title?: string;
  features: Feature[];
}

export interface FeatureGridProps {
  features: Feature[];
}

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link?: string;
  layoutId?: string;
}
