
export interface SlideData {
  title: string;
  icon: React.ReactNode;
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
