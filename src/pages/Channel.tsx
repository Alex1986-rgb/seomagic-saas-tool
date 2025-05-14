
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { YoutubeIcon, Video, Play, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const Channel: React.FC = () => {
  const videos = [
    {
      id: 1,
      title: 'SEO оптимизация для начинающих',
      description: 'В этом видео мы рассмотрим основы SEO оптимизации для начинающих.',
      thumbnail: '/images/placeholder.jpg',
      date: '10 мая 2024',
      views: 1250,
      link: '#',
    },
    {
      id: 2,
      title: 'Как повысить позиции в поисковой выдаче',
      description: 'Практические советы по повышению позиций вашего сайта в поисковой выдаче.',
      thumbnail: '/images/placeholder.jpg',
      date: '2 мая 2024',
      views: 980,
      link: '#',
    },
    {
      id: 3,
      title: 'Анализ конкурентов: как и зачем',
      description: 'Подробный разбор процесса анализа конкурентов и его важность для SEO.',
      thumbnail: '/images/placeholder.jpg',
      date: '25 апреля 2024',
      views: 1520,
      link: '#',
    },
  ];

  const channelInfo = {
    name: 'SeoMarket',
    subscribers: '5.2K',
    videos: '48',
    description: 'Образовательный канал о SEO оптимизации, продвижении сайтов и интернет-маркетинге. Делимся опытом, лайфхаками и актуальными стратегиями.',
    link: 'https://youtube.com'
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Channel Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start mb-16">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-3xl md:text-4xl font-bold shadow-lg"
          >
            <YoutubeIcon size={48} />
          </motion.div>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">{channelInfo.name}</h1>
                <div className="flex items-center gap-6 mt-2 text-muted-foreground">
                  <span>{channelInfo.subscribers} подписчиков</span>
                  <span>{channelInfo.videos} видео</span>
                </div>
              </div>
              
              <Button 
                size="lg"
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
              >
                <YoutubeIcon size={20} />
                Подписаться
              </Button>
            </div>
            
            <p className="mt-4 text-muted-foreground max-w-2xl">
              {channelInfo.description}
            </p>
            
            <div className="mt-6">
              <Button variant="outline" size="sm" asChild>
                <a href={channelInfo.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <ExternalLink size={16} />
                  Открыть канал на YouTube
                </a>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Latest Videos */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Последние видео</h2>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Video size={16} />
              Все видео
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <motion.div
                key={video.id}
                whileHover={{ y: -5 }}
                className="rounded-lg overflow-hidden border bg-card shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity">
                    <button className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center">
                      <Play size={24} />
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg truncate mb-2">{video.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{video.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{video.date}</span>
                    <span>{video.views} просмотров</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* About Channel */}
        <div>
          <h2 className="text-2xl font-bold mb-6">О канале</h2>
          
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              Мы создаем образовательный контент о SEO оптимизации, продвижении сайтов и интернет-маркетинге. Наши видео помогут вам разобраться в тонкостях работы поисковых систем и научиться эффективно продвигать ваш сайт.
            </p>
            <p>
              На нашем канале вы найдете:
            </p>
            <ul>
              <li>Практические советы по оптимизации сайтов</li>
              <li>Обзоры инструментов для SEO специалистов</li>
              <li>Кейсы и примеры успешного продвижения</li>
              <li>Интервью с экспертами отрасли</li>
              <li>Обучающие материалы для новичков</li>
            </ul>
            <p>
              Подписывайтесь на наш канал, чтобы не пропустить новые видео и быть в курсе последних трендов в области SEO и интернет-маркетинга.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Channel;
