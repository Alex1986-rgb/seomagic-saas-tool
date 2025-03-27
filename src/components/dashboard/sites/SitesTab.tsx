
import React from 'react';
import { Globe } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { SiteCard } from './SiteCard';
import { useNavigate } from 'react-router-dom';

interface SitesTabProps {
  onAddSite: () => void;
}

export const SitesTab: React.FC<SitesTabProps> = ({ onAddSite }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Оптимизированные сайты</h2>
        <Button className="gap-2" onClick={onAddSite}>
          <Globe size={16} className="mr-2" />
          Добавить сайт
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SiteCard 
          url="https://example.com" 
          lastOptimized="2023-10-12" 
          score={82} 
        />
        <SiteCard 
          url="https://company-blog.net" 
          lastOptimized="2023-10-08" 
          score={76} 
        />
        <SiteCard 
          url="https://online-store.com" 
          lastOptimized="2023-10-15" 
          score={65} 
        />
        <SiteCard 
          url="https://portfolio-site.net" 
          lastOptimized="2023-10-10" 
          score={89} 
        />
      </div>
    </div>
  );
};
