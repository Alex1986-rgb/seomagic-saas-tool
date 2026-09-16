
import { useState, useEffect } from 'react';
import { checkPositions, KeywordPosition, PositionData, PositionCheckProgress } from '@/services/position/positionTracker';
import { useToast } from './use-toast';

interface UsePositionTrackerProps {
  defaultDomain?: string;
  defaultKeywords?: string[];
  defaultSearchEngine?: string;
  defaultRegion?: string;
}

export function usePositionTracker({
  defaultDomain = '',
  defaultKeywords = [],
  defaultSearchEngine = 'google',
  defaultRegion = 'ru'
}: UsePositionTrackerProps = {}) {
  const [domain, setDomain] = useState(defaultDomain);
  const [keywords, setKeywords] = useState<string[]>(defaultKeywords);
  const [searchEngine, setSearchEngine] = useState(defaultSearchEngine);
  const [region, setRegion] = useState(defaultRegion);
  const [depth, setDepth] = useState(100);
  // Проверок по расписанию нет: каждая проверка разовая.
  const [scanFrequency, setScanFrequency] = useState('once');
  
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<PositionData | null>(null);
  // Проверка идёт в фоне и занимает минуты — без этого пользователь смотрит
  // на крутящийся индикатор, не понимая, движется ли дело.
  const [progress, setProgress] = useState<PositionCheckProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [historyUpdated, setHistoryUpdated] = useState(false);
  
  const { toast } = useToast();
  
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
      // Раньше здесь поднимался список прокси из браузера и без них выводилось
      // «Нет активных прокси. Проверка может быть менее точной». Позиции
      // проверяет сервер через поставщика выдачи — прокси на точность не влияют.

      // Форматируем домен для проверки
      let formattedDomain = domain.trim();
      
      // Добавляем протокол, если его нет
      if (!formattedDomain.match(/^https?:\/\//i)) {
        formattedDomain = 'http://' + formattedDomain;
      }
      
      // Удаляем trailing slash если он есть
      formattedDomain = formattedDomain.replace(/\/+$/, '');
      
      // Извлекаем только домен без протокола для проверки
      const domainForCheck = formattedDomain.replace(/^https?:\/\//i, '');
      
      // Фильтруем пустые ключевые слова
      const validKeywords = keywords.filter(k => k && k.trim() !== '');
      
      if (validKeywords.length === 0) {
        throw new Error('Все ключевые слова недействительны');
      }
      
      const data = {
        domain: domainForCheck,
        keywords: validKeywords,
        searchEngine,
        region,
        depth,
        scanFrequency
      };
      
      // Запускаем проверку позиций с использованием актуальных данных
      console.log('Запуск проверки позиций с параметрами:', data);
      const positionData = await checkPositions(data, setProgress);
      console.log('Получены результаты проверки:', positionData);
      setResults(positionData);
      
      // Выводим информацию по найденным позициям
      const inTop10 = positionData.keywords.filter(k => k.position > 0 && k.position <= 10).length;
      const inTop30 = positionData.keywords.filter(k => k.position > 0 && k.position <= 30).length;
      const notFound = positionData.keywords.filter(k => k.position === 0).length;
      
      console.log(`Статистика позиций: TOP-10: ${inTop10}, TOP-30: ${inTop30}, не найдено: ${notFound}`);
      
      // Показываем то, что реально проверено: при частичном сбое часть запросов
      // до поисковика не дошла, и молчать об этом нельзя.
      const failed = positionData.failures?.length ?? 0;
      toast({
        title: failed > 0 ? "Проверено частично" : "Готово",
        description: failed > 0
          ? `Получены позиции по ${positionData.keywords.length} запросам, ${failed} не проверено`
          : `Проверено ${positionData.keywords.length} запросов для ${domainForCheck}`,
        variant: failed > 0 ? "destructive" : undefined,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Произошла ошибка при проверке позиций";
      console.error('Ошибка проверки позиций:', errorMessage);
      setError(errorMessage);
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const addKeyword = (keyword: string) => {
    if (keyword && !keywords.includes(keyword)) {
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
    progress,
    results,
    error,
    trackPositions,
    historyUpdated
  };
}
