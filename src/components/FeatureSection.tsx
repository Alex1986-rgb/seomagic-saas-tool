
import React, { useEffect, useRef } from 'react';
import { CheckCircle2, FileText, Globe, RefreshCw, ShieldCheck, Zap } from 'lucide-react';

const FeatureSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/20" ref={sectionRef}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-on-scroll">
            Комплексное SEO решение
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-on-scroll">
            Анализируйте, оптимизируйте и контролируйте SEO-производительность вашего сайта с помощью нашего полного набора инструментов.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<CheckCircle2 size={24} className="text-primary" />}
            title="Полный SEO аудит"
            description="Глубокий анализ мета-тегов, заголовков, изображений, ссылок и многого другого для выявления всех SEO-проблем."
          />
          <FeatureCard
            icon={<FileText size={24} className="text-primary" />}
            title="Подробные отчеты"
            description="Получите комплексные PDF-отчеты с практическими рекомендациями и приоритизированными рекомендациями."
          />
          <FeatureCard
            icon={<Globe size={24} className="text-primary" />}
            title="Оптимизированная копия сайта"
            description="Получите полностью оптимизированную версию вашего сайта с улучшенными SEO-элементами."
          />
          <FeatureCard
            icon={<RefreshCw size={24} className="text-primary" />}
            title="Сравнение До/После"
            description="Увидьте разницу между вашим оригинальным сайтом и оптимизированной версией."
          />
          <FeatureCard
            icon={<ShieldCheck size={24} className="text-primary" />}
            title="Технические SEO исправления"
            description="Автоматическая генерация sitemap.xml, robots.txt и структурированных данных."
          />
          <FeatureCard
            icon={<Zap size={24} className="text-primary" />}
            title="ИИ-рекомендации"
            description="Интеллектуальные рекомендации для мета-заголовков, описаний и оптимизации контента."
          />
        </div>
      </div>
    </section>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <div className="neo-card p-6 animate-on-scroll">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureSection;
