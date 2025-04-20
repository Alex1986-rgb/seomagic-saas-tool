
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export interface PageAnalysisData {
  url: string;
  title: string | null;
  metaDescription: string | null;
  h1Count: number;
  imageCount: number;
  wordCount: number;
  loadTime: number | null;
  statusCode: number | null;
}

export const usePageAnalysis = (auditId: string | undefined) => {
  const [data, setData] = useState<PageAnalysisData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchPageAnalysis = async () => {
    if (!auditId) return;
    
    setIsLoading(true);
    try {
      const { data: analysisData, error } = await supabase
        .from('page_analysis')
        .select('*')
        .eq('audit_id', auditId);
        
      if (error) throw error;
      
      // Sort the data by URL for consistent display
      const sortedData = [...(analysisData || [])].sort((a, b) => a.url.localeCompare(b.url));
      
      setData(sortedData.map(item => ({
        url: item.url,
        title: item.title,
        metaDescription: item.meta_description,
        h1Count: item.h1_count,
        imageCount: item.image_count,
        wordCount: item.word_count,
        loadTime: item.load_time,
        statusCode: item.status_code
      })));
    } catch (error) {
      console.error('Error fetching page analysis:', error);
      toast({
        title: "Ошибка загрузки анализа страниц",
        description: "Не удалось загрузить детальный анализ страниц",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPageAnalysis();
  }, [auditId]);

  return { data, isLoading, refetch: fetchPageAnalysis };
};
