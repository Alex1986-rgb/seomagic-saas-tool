
import React from 'react';
import { FileText } from 'lucide-react';
import VideoPlayer from '@/components/video/VideoPlayer';

interface GuideVideoProps {
  videoUrl: string;
  poster: string;
  title: string;
}

const GuideVideo: React.FC<GuideVideoProps> = ({ videoUrl, poster, title }) => {
  return (
    <div className="mb-10">
      <div className="bg-card/30 rounded-lg overflow-hidden border border-primary/10">
        <VideoPlayer 
          src={videoUrl || "/video/seo-demo.mp4"}
          poster={poster}
          title={`Видеоруководство: ${title}`}
          description="Посмотрите пошаговое объяснение процесса"
          showInfo={true}
          className="w-full aspect-video"
        />
      </div>
      <div className="mt-4 flex items-center text-sm text-muted-foreground">
        <FileText className="h-4 w-4 mr-1" />
        <span>Рекомендуем просмотреть видео полностью для лучшего понимания</span>
      </div>
    </div>
  );
};

export default GuideVideo;
