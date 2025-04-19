
import React from 'react';
import { GuideContent as GuideContentType } from '@/types/guides';
import { LazyImage } from '@/components/LazyImage';
import VideoPlayer from '@/components/video/VideoPlayer';

interface GuideContentProps {
  content?: GuideContentType[];
}

const GuideContent: React.FC<GuideContentProps> = ({ content }) => {
  if (!content || content.length === 0) {
    return (
      <p className="text-muted-foreground">
        Подробное содержание этого руководства в настоящее время разрабатывается.
      </p>
    );
  }

  return (
    <div className="space-y-10">
      {content.map((section, index) => (
        <section key={index} className="bg-card/30 p-8 rounded-lg border border-primary/10">
          <h2 className="text-2xl font-semibold mb-6">{section.title}</h2>
          <p className="mb-6">{section.content}</p>
          
          <div className="bg-black/5 p-4 rounded-lg">
            <h4 className="text-sm uppercase font-medium text-muted-foreground mb-2">
              Скриншот инструкции
            </h4>
            <div className="rounded-lg overflow-hidden border border-primary/10">
              <LazyImage 
                src={section.image}
                alt={section.title}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="mt-6 bg-black/5 p-4 rounded-lg">
            <h4 className="text-sm uppercase font-medium text-muted-foreground mb-2">
              Видеоинструкция по разделу
            </h4>
            <div className="rounded-lg overflow-hidden border border-primary/10">
              <VideoPlayer
                src={section.videoUrl || "/video/seo-demo.mp4"}
                poster={section.image}
                title={section.title}
                showInfo={false}
                className="w-full aspect-video"
              />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default GuideContent;
