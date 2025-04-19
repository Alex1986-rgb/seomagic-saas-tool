
import React from 'react';
import Layout from '@/components/Layout';
import SeoOptimizationPanel from '@/components/seo-optimization/SeoOptimizationPanel';
import { SEO } from '@/components/SEO';

const SeoOptimizationPage: React.FC = () => {
  return (
    <Layout>
      <SEO 
        title="SEO Аудит и Оптимизация Сайтов"
        description="Полностью автоматизированная система для SEO аудита и оптимизации сайтов. Исправляйте SEO ошибки и повышайте рейтинг вашего сайта в поисковых системах."
        keywords="SEO, аудит, оптимизация, сайт, поисковая оптимизация, метатеги, контент, производительность"
      />
      
      <div className="container mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-12 md:pb-20">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            SEO Аудит и Оптимизация Сайта
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Автоматическое сканирование, анализ и оптимизация сайта для 
            улучшения SEO показателей и повышения позиций в поисковых системах
          </p>
        </div>
        
        <SeoOptimizationPanel />
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center p-6 border border-primary/10 rounded-lg backdrop-blur-sm bg-card/80 shadow-sm">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Глубокий аудит сайта</h3>
            <p className="text-muted-foreground">
              Сканирование всех страниц вашего сайта и выявление критических проблем, 
              влияющих на SEO и ранжирование
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 border border-primary/10 rounded-lg backdrop-blur-sm bg-card/80 shadow-sm">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">ИИ-оптимизация</h3>
            <p className="text-muted-foreground">
              Использование искусственного интеллекта для создания SEO-оптимизированного 
              контента, мета-тегов и заголовков
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 border border-primary/10 rounded-lg backdrop-blur-sm bg-card/80 shadow-sm">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Готовый результат</h3>
            <p className="text-muted-foreground">
              Получите полностью оптимизированную версию вашего сайта, 
              готовую к публикации на вашем хостинге
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SeoOptimizationPage;
