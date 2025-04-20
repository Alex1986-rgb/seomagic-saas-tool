
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { auditApiService } from '@/api';
import { BrokenLink, DuplicatePage, SiteStructure, ContentAnalysisResult } from '@/services/audit/siteAnalysis';

export const useSiteAnalysis = (domain: string, urls: string[]) => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisType, setAnalysisType] = useState<string>('');
  
  const [brokenLinks, setBrokenLinks] = useState<BrokenLink[]>([]);
  const [redirects, setRedirects] = useState<any[]>([]);
  const [duplicates, setDuplicates] = useState<DuplicatePage[]>([]);
  const [duplicateMeta, setDuplicateMeta] = useState<any[]>([]);
  const [siteStructure, setSiteStructure] = useState<SiteStructure | null>(null);
  const [contentAnalysis, setContentAnalysis] = useState<ContentAnalysisResult | null>(null);

  const analyzeBrokenLinks = useCallback(async () => {
    if (!domain || urls.length === 0) {
      toast({
        title: "Ошибка анализа",
        description: "Недостаточно данных для анализа битых ссылок",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisType('broken-links');
    setAnalysisProgress(0);
    
    try {
      const result = await auditApiService.findBrokenLinks(
        domain, 
        urls,
        (current: number, total: number) => {
          setAnalysisProgress(Math.floor((current / total) * 100));
        }
      );
      
      setBrokenLinks(result.brokenLinks);
      setRedirects(result.redirects);
      
      toast({
        title: "Анализ завершен",
        description: `Найдено ${result.brokenLinks.length} битых ссылок и ${result.redirects.length} редиректов`,
      });
    } catch (error) {
      console.error('Ошибка при анализе битых ссылок:', error);
      toast({
        title: "Ошибка анализа",
        description: "Не удалось выполнить анализ битых ссылок",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [domain, urls, toast]);

  const analyzeDuplicates = useCallback(async () => {
    if (urls.length === 0) {
      toast({
        title: "Ошибка анализа",
        description: "Недостаточно данных для анализа дубликатов",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisType('duplicates');
    setAnalysisProgress(0);
    
    try {
      const result = await auditApiService.findDuplicates(
        urls,
        (current: number, total: number) => {
          setAnalysisProgress(Math.floor((current / total) * 100));
        }
      );
      
      setDuplicates(result.duplicatePages);
      setDuplicateMeta(result.duplicateMeta);
      
      toast({
        title: "Анализ дубликатов завершен",
        description: `Найдено ${result.duplicatePages.length} дубликатов страниц и ${result.duplicateMeta.length} дубликатов мета-тегов`,
      });
    } catch (error) {
      console.error('Ошибка при анализе дубликатов:', error);
      toast({
        title: "Ошибка анализа",
        description: "Не удалось выполнить анализ дубликатов",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [urls, toast]);

  const analyzeSiteStructure = useCallback(async () => {
    if (!domain || urls.length === 0) {
      toast({
        title: "Ошибка анализа",
        description: "Недостаточно данных для анализа структуры сайта",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisType('site-structure');
    setAnalysisProgress(0);
    
    try {
      const result = await auditApiService.analyzeSiteStructure(
        domain,
        urls,
        (current: number, total: number) => {
          setAnalysisProgress(Math.floor((current / total) * 100));
        }
      );
      
      setSiteStructure(result);
      
      toast({
        title: "Анализ структуры завершен",
        description: `Проанализирована структура сайта с ${result.nodes.length} страницами`,
      });
    } catch (error) {
      console.error('Ошибка при анализе структуры сайта:', error);
      toast({
        title: "Ошибка анализа",
        description: "Не удалось выполнить анализ структуры сайта",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [domain, urls, toast]);

  const analyzeContentUniqueness = useCallback(async () => {
    if (urls.length === 0) {
      toast({
        title: "Ошибка анализа",
        description: "Недостаточно данных для анализа уникальности контента",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisType('content-uniqueness');
    setAnalysisProgress(0);
    
    try {
      const result = await auditApiService.analyzeContentUniqueness(
        urls,
        (current: number, total: number) => {
          setAnalysisProgress(Math.floor((current / total) * 100));
        }
      );
      
      setContentAnalysis(result);
      
      toast({
        title: "Анализ контента завершен",
        description: `Общая уникальность: ${result.overallUniqueness.toFixed(1)}%. Уникальных страниц: ${result.uniquePages}`,
      });
    } catch (error) {
      console.error('Ошибка при анализе уникальности контента:', error);
      toast({
        title: "Ошибка анализа",
        description: "Не удалось выполнить анализ уникальности контента",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [urls, toast]);

  return {
    isAnalyzing,
    analysisProgress,
    analysisType,
    brokenLinks,
    redirects,
    duplicates,
    duplicateMeta,
    siteStructure,
    contentAnalysis,
    analyzeBrokenLinks,
    analyzeDuplicates,
    analyzeSiteStructure,
    analyzeContentUniqueness
  };
};
