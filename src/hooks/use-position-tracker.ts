
import { useState } from 'react';
import { checkPositions, KeywordPosition, PositionData } from '@/services/position/positionTracker';
import { useToast } from './use-toast';

interface UsePositionTrackerProps {
  defaultDomain?: string;
  defaultKeywords?: string[];
  defaultSearchEngine?: string;
}

export function usePositionTracker({
  defaultDomain = '',
  defaultKeywords = [],
  defaultSearchEngine = 'google'
}: UsePositionTrackerProps = {}) {
  const [domain, setDomain] = useState(defaultDomain);
  const [keywords, setKeywords] = useState<string[]>(defaultKeywords);
  const [searchEngine, setSearchEngine] = useState(defaultSearchEngine);
  const [region, setRegion] = useState('ru');
  const [depth, setDepth] = useState(100);
  const [scanFrequency, setScanFrequency] = useState('daily');
  
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<PositionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  
  const trackPositions = async () => {
    if (!domain) {
      toast({
        title: "Ошибка",
        description: "Укажите домен для проверки",
        variant: "destructive",
      });
      return;
    }
    
    if (keywords.length === 0) {
      toast({
        title: "Ошибка",
        description: "Добавьте хотя бы одно ключевое слово",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = {
        domain,
        keywords,
        searchEngine,
        region,
        depth,
        scanFrequency
      };
      
      const positionData = await checkPositions(data);
      setResults(positionData);
      
      toast({
        title: "Готово",
        description: `Проверено ${keywords.length} ключевых слов для ${domain}`,
      });
    } catch (err) {
      setError(err.message || "Произошла ошибка при проверке позиций");
      toast({
        title: "Ошибка",
        description: "Не удалось проверить позиции",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const addKeyword = (keyword: string) => {
    if (!keywords.includes(keyword)) {
      setKeywords([...keywords, keyword]);
    }
  };
  
  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };
  
  return {
    domain,
    setDomain,
    keywords,
    setKeywords,
    addKeyword,
    removeKeyword,
    searchEngine,
    setSearchEngine,
    region,
    setRegion,
    depth,
    setDepth,
    scanFrequency,
    setScanFrequency,
    isLoading,
    results,
    error,
    trackPositions
  };
}
