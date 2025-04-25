
import React from 'react';
import { BarChart, Monitor } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import VideoDemo from '@/components/video/VideoDemo';
import FeatureCard from './FeatureCard';

const DemoTab: React.FC = () => {
  return (
    <Card className="bg-[#181929] shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <BarChart className="h-5 w-5 text-[#F97316]" />
          Возможности сканера
        </CardTitle>
        <CardDescription className="text-[#36CFFF]">
          Мощные технологии для глубокого анализа сайтов
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <VideoDemo autoplay={true} interval={7000} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-8">
          <FeatureCard
            icon={BarChart}
            iconColor="text-[#8B5CF6]"
            title="Полный аудит сайта"
            description="Комплексная проверка технических и SEO аспектов сайта."
          />
          <FeatureCard
            icon={Monitor}
            iconColor="text-[#36CFFF]"
            title="Анализ структуры и метаданных"
            description="Визуализация sitemap, сканирование страниц, советы по оптимизации."
          />
          <FeatureCard
            icon={BarChart}
            iconColor="text-[#F97316]"
            title="Генерация карт сайта"
            description="Автоматическое создание XML и HTML карт сайта для поисковых систем."
          />
          <FeatureCard
            icon={Monitor}
            iconColor="text-[#36CFFF]"
            title="Персональные рекомендации"
            description="Советы по SEO и производительности для вашего сайта."
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoTab;
