
import React from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';

interface VideoInfoProps {
  title?: string;
  description?: string;
}

const VideoInfo: React.FC<VideoInfoProps> = ({ 
  title = "Полный SEO-аудит за 60 секунд",
  description = "Увеличьте трафик и видимость сайта с помощью нашего инструмента"
}) => {
  return (
    <div className="neo-glass p-6 md:p-8 mt-6 rounded-xl border border-primary/20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-full">
            <Star className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <Button className="gap-2" asChild>
          <a href="/demo">
            Попробовать бесплатно <ArrowRight className="w-4 h-4" />
          </a>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="p-3 text-center bg-background/60 rounded-lg border border-primary/10">
          <div className="font-bold text-lg">100+</div>
          <div className="text-sm text-muted-foreground">SEO-факторов</div>
        </div>
        <div className="p-3 text-center bg-background/60 rounded-lg border border-primary/10">
          <div className="font-bold text-lg">150%</div>
          <div className="text-sm text-muted-foreground">Рост трафика</div>
        </div>
        <div className="p-3 text-center bg-background/60 rounded-lg border border-primary/10">
          <div className="font-bold text-lg">3 мин</div>
          <div className="text-sm text-muted-foreground">Время анализа</div>
        </div>
      </div>
    </div>
  );
};

export default VideoInfo;
