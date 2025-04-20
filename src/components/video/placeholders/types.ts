
import { LucideIcon } from 'lucide-react';

export interface SlideData {
  title: string;
  description: string;
  blogId: number;
  color: string;
  icon: LucideIcon;
  image?: string;
}

export interface AnimatedVideoPlaceholderProps {
  isPlaying: boolean;
}
