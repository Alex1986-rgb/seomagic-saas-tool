
import { LucideIcon } from 'lucide-react';

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  link?: string;
  category?: string;
  content?: string;
  benefits?: string[];
}

// Adding FeatureData type that was missing
export interface FeatureData extends Feature {
  category: string;
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
