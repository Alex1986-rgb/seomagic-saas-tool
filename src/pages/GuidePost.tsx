import React from 'react';
import Layout from '@/components/Layout';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { guides } from '@/data/guidesData';
import GuideHeader from '@/components/guides/GuideHeader';
import GuideVideo from '@/components/guides/GuideVideo';
import GuideCarousel from '@/components/guides/GuideCarousel';
import GuideContent from '@/components/guides/GuideContent';
import GuideCallToAction from '@/components/guides/GuideCallToAction';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

const GuidePost: React.FC = () => {
  const { id } = useParams();
  // Convert id from string to number for comparison
  const guide = guides.find(g => g.id === Number(id));
  
  if (!guide) {
    return (
      <Layout>
        <BreadcrumbSchema items={[
          { name: 'Главная', url: '/' },
          { name: 'Руководства', url: '/guides' }
        ]} />
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
      <BreadcrumbSchema items={[
        { name: 'Главная', url: '/' },
        { name: 'Руководства', url: '/guides' },
        { name: guide.title, url: `/guides/${guide.id}` }
      ]} />
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto">
          <GuideHeader
            category={guide.category}
            level={guide.level}
            duration={guide.duration}
            title={guide.title}
            description={guide.description}
          />
          
          <GuideVideo
            videoUrl={guide.videoUrl || "/video/seo-demo.mp4"}
            poster={guide.image}
            title={guide.title}
          />

          <GuideCarousel
            image={guide.image}
            title={guide.title}
            description={guide.description}
            content={guide.content}
          />

          <div className="prose prose-lg max-w-none">
            <GuideContent content={guide.content} />
            <GuideCallToAction />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GuidePost;
