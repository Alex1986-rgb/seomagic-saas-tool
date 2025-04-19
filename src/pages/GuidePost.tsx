
import React from 'react';
import Layout from '@/components/Layout';
import { useParams } from 'react-router-dom';
import { LazyImage } from '@/components/LazyImage';

const GuidePost: React.FC = () => {
  const { id } = useParams();
  
  // Find the guide by id from our mock data
  const guide = guides.find(g => g.id === Number(id));
  
  if (!guide) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32">
          <h1 className="text-2xl font-bold">Руководство не найдено</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <span className="bg-primary/10 px-2 py-1 rounded">{guide.category}</span>
              <span>{guide.level}</span>
              <span>{guide.duration}</span>
            </div>
            <h1 className="text-4xl font-bold mb-6">{guide.title}</h1>
          </div>

          <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
            <LazyImage 
              src={guide.image} 
              alt={guide.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground mb-8">{guide.description}</p>
            <div className="space-y-6">
              {guide.content.map((section, index) => (
                <section key={index}>
                  <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
                  <p>{section.content}</p>
                  {section.image && (
                    <div className="my-6">
                      <LazyImage 
                        src={section.image}
                        alt={section.title}
                        className="rounded-lg w-full"
                      />
                    </div>
                  )}
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GuidePost;
