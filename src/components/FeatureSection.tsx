
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
            All-in-One SEO Solution
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-on-scroll">
            Analyze, optimize, and monitor your website's SEO performance with our comprehensive suite of tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<CheckCircle2 size={24} className="text-primary" />}
            title="Complete SEO Audit"
            description="Deep analysis of meta tags, headings, images, links, and more to identify all SEO issues."
          />
          <FeatureCard
            icon={<FileText size={24} className="text-primary" />}
            title="Detailed Reports"
            description="Get comprehensive PDF reports with actionable insights and prioritized recommendations."
          />
          <FeatureCard
            icon={<Globe size={24} className="text-primary" />}
            title="Optimized Site Copy"
            description="Receive a fully optimized version of your site with improved SEO elements."
          />
          <FeatureCard
            icon={<RefreshCw size={24} className="text-primary" />}
            title="Before/After Comparison"
            description="See the difference between your original site and the optimized version."
          />
          <FeatureCard
            icon={<ShieldCheck size={24} className="text-primary" />}
            title="Technical SEO Fixes"
            description="Automatic generation of sitemaps, robots.txt, and structured data."
          />
          <FeatureCard
            icon={<Zap size={24} className="text-primary" />}
            title="AI-Powered Suggestions"
            description="Intelligent recommendations for meta titles, descriptions, and content optimizations."
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
