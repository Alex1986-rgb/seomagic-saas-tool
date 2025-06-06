
import React, { useState } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AuditCategorySection } from './category';
import { AuditDetailsData } from '@/types/audit';
import { AuditTabsList } from './AuditTabsList';

interface AuditTabsProps {
  details: AuditDetailsData;
}

const AuditTabs: React.FC<AuditTabsProps> = ({ details }) => {
  const [activeTab, setActiveTab] = useState("seo");
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  return (
    <div className="neo-card p-4 sm:p-6 mb-6 sm:mb-8">
      <Tabs defaultValue="seo" value={activeTab} onValueChange={handleTabChange}>
        <AuditTabsList activeTab={activeTab} />
        
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
        
        <TabsContent value="usability">
          <AuditCategorySection 
            title="Удобство использования"
            score={details.usability.score}
            previousScore={details.usability.previousScore}
            items={details.usability.items}
            description="Анализ удобства использования сайта для посетителей, что влияет на конверсию и вовлеченность."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditTabs;
