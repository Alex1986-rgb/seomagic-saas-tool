
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import AuditSummary from './AuditSummary';
import AuditLoading from './audit/AuditLoading';
import AuditTabs from './audit/AuditTabs';
import AuditRecommendations from './audit/AuditRecommendations';
import AuditShareResults from './audit/AuditShareResults';
import { fetchAuditData, fetchRecommendations } from '@/services/auditService';
import { AuditData, RecommendationData } from '@/types/audit';

interface SeoAuditResultsProps {
  url: string;
}

const SeoAuditResults: React.FC<SeoAuditResultsProps> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationData | null>(null);
  const { toast } = useToast();

  // Загрузка данных аудита
  useEffect(() => {
    const loadAuditData = async () => {
      setIsLoading(true);
      
      try {
        const [auditResult, recommendationsResult] = await Promise.all([
          fetchAuditData(url),
          fetchRecommendations()
        ]);
        
        setAuditData(auditResult);
        setRecommendations(recommendationsResult);
        
        toast({
          title: "Аудит завершен",
          description: "SEO аудит сайта успешно завершен",
        });
      } catch (error) {
        console.error('Error loading audit data:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить результаты аудита",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAuditData();
  }, [url, toast]);

  if (isLoading) {
    return <AuditLoading />;
  }

  if (!auditData || !recommendations) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg text-red-500">Не удалось загрузить данные аудита</p>
      </div>
    );
  }

  return (
    <div>
      <AuditSummary 
        url={url} 
        score={auditData.score}
        date={auditData.date}
        issues={auditData.issues}
      />
      
      <AuditTabs details={auditData.details} />
      
      <AuditRecommendations recommendations={recommendations} />
      
      <AuditShareResults auditId={auditData.id} />
    </div>
  );
};

export default SeoAuditResults;
