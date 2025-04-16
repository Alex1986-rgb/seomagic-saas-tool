
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "./use-toast";
import useUrlValidator from './use-url-validator';
import useWebsiteChecker from './use-website-checker';

interface UseUrlFormProps {
  defaultOptions?: {
    maxPages: number;
    scanDepth: number;
    followExternalLinks: boolean;
    analyzeMobile: boolean;
    checkSecurity: boolean;
    checkPerformance: boolean;
  };
}

export const useUrlForm = ({ defaultOptions }: UseUrlFormProps = {}) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progressStage, setProgressStage] = useState(0);
  const [advancedOptions, setAdvancedOptions] = useState(defaultOptions || {
    maxPages: 250000,
    scanDepth: 50,
    followExternalLinks: false,
    analyzeMobile: true,
    checkSecurity: true,
    checkPerformance: true
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isValid, validateUrl, formatUrl } = useUrlValidator();
  const { checkWebsiteAccessibility, runAnalysisStages } = useWebsiteChecker();

  // Handle URL changes
  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    validateUrl(newUrl);
  };

  // Handle advanced options changes
  const handleAdvancedOptionsChange = (key: string, value: any) => {
    setAdvancedOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast({
        title: "URL обязателен",
        description: "Пожалуйста, введите корректный URL сайта",
        variant: "destructive",
      });
      return;
    }
    
    let formattedUrl = formatUrl(url);
    
    try {
      new URL(formattedUrl);
    } catch (err) {
      toast({
        title: "Некорректный URL",
        description: "Пожалуйста, введите корректный URL сайта",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    const isAccessible = await checkWebsiteAccessibility(formattedUrl);
    
    if (!isAccessible) {
      setIsLoading(false);
      return;
    }
    
    const clearStageInterval = runAnalysisStages(
      (stage, description) => {
        setProgressStage(stage);
        toast({
          title: "Анализируем сайт",
          description,
        });
      },
      () => {
        setIsLoading(false);
        navigate(`/audit?url=${encodeURIComponent(formattedUrl)}`);
      }
    );
    
    return () => clearStageInterval();
  };

  return {
    url,
    isLoading,
    isValid,
    progressStage,
    advancedOptions,
    handleUrlChange,
    handleAdvancedOptionsChange,
    handleSubmit
  };
};

export default useUrlForm;
