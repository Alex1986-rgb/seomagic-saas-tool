
import { LucideIcon } from 'lucide-react';

export interface SlideData {
  title: string;
  icon: LucideIcon;
  content: string;
  color: string;
}

export interface SlideProps {
  slideData: SlideData;
  currentSlide: number;
  slideIndex: number;
}

export interface AnimatedVideoPlaceholderProps {
  isPlaying: boolean;
}
