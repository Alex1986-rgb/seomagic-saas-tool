
import { useState, useEffect } from 'react';
import { checkPositions, KeywordPosition, PositionData } from '@/services/position/positionTracker';
import { useProxyManager } from './use-proxy-manager';
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
  const [historyUpdated, setHistoryUpdated] = useState(false);
  
  const { toast } = useToast();
  const { getRandomActiveProxy, activeProxies } = useProxyManager();
  
  // Слушаем события обновления истории
  useEffect(() => {
    const handleHistoryUpdated = () => {
      console.log('Получено событие обновления истории позиций');
      setHistoryUpdated(prev => !prev);
    };
    
    window.addEventListener('position-history-updated', handleHistoryUpdated);
    
    return () => {
      window.removeEventListener('position-history-updated', handleHistoryUpdated);
    };
  }, []);
  
  const trackPositions = async () => {
    if (!domain) {
      toast({
        title: "Ошибка",
        description: "Укажите домен для проверки",
        variant: "destructive",
      });
      return null;
    }
    
    if (keywords.length === 0) {
      toast({
        title: "Ошибка",
        description: "Добавьте хотя бы одно ключевое слово",
        variant: "destructive",
      });
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Запуск проверки позиций для домена ${domain} с ключевыми словами: ${keywords.join(', ')}`);
      
      // Проверяем наличие прокси
      const hasActiveProxies = activeProxies.length > 0;
      
      if (!hasActiveProxies) {
        console.log('Нет активных прокси. Проверка будет выполнена без использования прокси.');
        toast({
          title: "Внимание",
          description: "Нет активных прокси. Проверка может быть менее точной.",
          variant: "default",
        });
      } else {
        console.log(`Доступно ${activeProxies.length} активных прокси для проверки позиций`);
      }
      
      const data = {
        domain,
        keywords,
        searchEngine,
        region,
        depth,
        scanFrequency,
        useProxy: hasActiveProxies // Используем прокси только если они есть
      };
      
      // Запускаем проверку позиций с использованием актуальных данных
      console.log('Запуск проверки позиций с параметрами:', data);
      const positionData = await checkPositions(data);
      console.log('Получены результаты проверки:', positionData);
      setResults(positionData);
      
      // Выводим информацию по найденным позициям
      const inTop10 = positionData.keywords.filter(k => k.position > 0 && k.position <= 10).length;
      const inTop30 = positionData.keywords.filter(k => k.position > 0 && k.position <= 30).length;
      const notFound = positionData.keywords.filter(k => k.position === 0).length;
      
      console.log(`Статистика позиций: TOP-10: ${inTop10}, TOP-30: ${inTop30}, не найдено: ${notFound}`);
      
      toast({
        title: "Готово",
        description: `Проверено ${keywords.length} ключевых слов для ${domain}`,
      });
      
      return positionData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Произошла ошибка при проверке позиций";
      console.error('Ошибка проверки позиций:', errorMessage);
      setError(errorMessage);
      toast({
        title: "Ошибка",
        description: "Не удалось проверить позиции",
        variant: "destructive",
      });
      return null;
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
    trackPositions,
    historyUpdated,
    hasActiveProxies: activeProxies.length > 0
  };
}
