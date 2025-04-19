
export interface GuideContent {
  title: string;
  content: string;
  image: string;
  videoUrl?: string;
}

export interface Guide {
  id: number;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  image: string;
  videoUrl?: string;
  content?: GuideContent[];
}
