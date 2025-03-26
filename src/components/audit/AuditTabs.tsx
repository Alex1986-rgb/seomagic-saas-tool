
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuditCategorySection } from './category';
import { AuditDetailsData } from '@/types/audit';

interface AuditTabsProps {
  details: AuditDetailsData;
}

const AuditTabs: React.FC<AuditTabsProps> = ({ details }) => {
  return (
    <div className="neo-card p-6 mb-8">
      <Tabs defaultValue="seo">
        <TabsList className="mb-6 grid grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="performance">Производительность</TabsTrigger>
          <TabsTrigger value="content">Контент</TabsTrigger>
          <TabsTrigger value="technical">Технические аспекты</TabsTrigger>
        </TabsList>
        
        <TabsContent value="seo">
          <AuditCategorySection 
            title="SEO оптимизация"
            score={details.seo.score}
            previousScore={details.seo.previousScore}
            items={details.seo.items}
            description="Анализ SEO-факторов, которые влияют на ранжирование вашего сайта в поисковых системах."
          />
        </TabsContent>
        
        <TabsContent value="performance">
          <AuditCategorySection 
            title="Производительность"
            score={details.performance.score}
            previousScore={details.performance.previousScore}
            items={details.performance.items}
            description="Анализ скорости и производительности вашего сайта, которые влияют на удобство использования и SEO."
          />
        </TabsContent>
        
        <TabsContent value="content">
          <AuditCategorySection 
            title="Контент"
            score={details.content.score}
            previousScore={details.content.previousScore}
            items={details.content.items}
            description="Анализ содержимого страниц, включая тексты, заголовки, ключевые слова и медиафайлы."
          />
        </TabsContent>
        
        <TabsContent value="technical">
          <AuditCategorySection 
            title="Технические аспекты"
            score={details.technical.score}
            previousScore={details.technical.previousScore}
            items={details.technical.items}
            description="Анализ технических аспектов сайта, влияющих на индексацию и работу поисковых систем."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditTabs;
