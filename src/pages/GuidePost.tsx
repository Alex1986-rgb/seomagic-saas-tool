
import React from 'react';
import Layout from '@/components/Layout';
import { useParams, Link } from 'react-router-dom';
import { LazyImage } from '@/components/LazyImage';
import { Button } from "@/components/ui/button";
import { VideoPlayer } from '@/components/video';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel";
import { ChevronLeft, BookOpen, Clock, FileText } from 'lucide-react';

// Import the guides data from the Guides page
import { guides } from '@/pages/Guides';

const GuidePost: React.FC = () => {
  const { id } = useParams();
  
  // Find the guide by id from our mock data
  const guide = guides.find(g => g.id === Number(id));
  
  if (!guide) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Руководство не найдено</h1>
            <p className="text-muted-foreground mb-6">Запрашиваемое руководство не существует или было удалено</p>
            <Button asChild>
              <Link to="/guides">Вернуться к списку руководств</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to="/guides" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Назад к руководствам
            </Link>
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">{guide.category}</span>
              <span className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                {guide.level}
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {guide.duration}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-6">{guide.title}</h1>
            <p className="text-lg text-muted-foreground mb-8">{guide.description}</p>
          </div>
          
          {/* Video player for guide content */}
          <div className="mb-10">
            <div className="bg-card/30 rounded-lg overflow-hidden border border-primary/10">
              <VideoPlayer 
                src="/video/seo-demo.mp4"
                poster={guide.image}
                title={`Видеоруководство: ${guide.title}`}
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

          {guide.content && guide.content.length > 0 ? (
            <div className="mb-12">
              <Carousel className="w-full mb-8">
                <CarouselContent>
                  <CarouselItem>
                    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
                      <LazyImage 
                        src={guide.image} 
                        alt={guide.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                        <h2 className="text-white text-2xl font-semibold">Обзор руководства</h2>
                      </div>
                    </div>
                  </CarouselItem>
                  
                  {guide.content.map((section, idx) => (
                    <CarouselItem key={idx}>
                      <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
                        <LazyImage 
                          src={section.image} 
                          alt={section.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                          <h2 className="text-white text-2xl font-semibold">{section.title}</h2>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </div>
          ) : (
            <div className="relative w-full h-[400px] mb-12 rounded-lg overflow-hidden">
              <LazyImage 
                src={guide.image} 
                alt={guide.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            {guide.content && guide.content.length > 0 ? (
              <div className="space-y-10">
                {guide.content.map((section, index) => (
                  <section key={index} className="bg-card/30 p-8 rounded-lg border border-primary/10">
                    <h2 className="text-2xl font-semibold mb-6">{section.title}</h2>
                    <p className="mb-6">{section.content}</p>
                    
                    <div className="bg-black/5 p-4 rounded-lg">
                      <h4 className="text-sm uppercase font-medium text-muted-foreground mb-2">Скриншот инструкции</h4>
                      <div className="rounded-lg overflow-hidden border border-primary/10">
                        <LazyImage 
                          src={section.image}
                          alt={section.title}
                          className="w-full"
                        />
                      </div>
                    </div>
                    
                    {/* Video for each content section */}
                    <div className="mt-6 bg-black/5 p-4 rounded-lg">
                      <h4 className="text-sm uppercase font-medium text-muted-foreground mb-2">Видеоинструкция по разделу</h4>
                      <div className="rounded-lg overflow-hidden border border-primary/10">
                        <VideoPlayer
                          src="/video/seo-demo.mp4" 
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
            ) : (
              <p className="text-muted-foreground">Подробное содержание этого руководства в настоящее время разрабатывается.</p>
            )}
            
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-xl font-semibold mb-4">Готовы применить это руководство?</h3>
              <p className="mb-6">Используйте полученные знания для улучшения вашего SEO-продвижения и отслеживайте результаты.</p>
              
              <div className="flex flex-wrap gap-4">
                <Button asChild>
                  <Link to="/audit">Запустить аудит сайта</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/guides">Другие руководства</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GuidePost;
