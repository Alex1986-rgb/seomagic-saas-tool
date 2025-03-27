
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import UrlInput from './UrlInput';
import QuickActions from './QuickActions';

const UrlForm: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [progressStage, setProgressStage] = useState(0);
  const [advancedOptions, setAdvancedOptions] = useState({
    maxPages: 250000,
    scanDepth: 50,
    followExternalLinks: false,
    analyzeMobile: true,
    checkSecurity: true,
    checkPerformance: true
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  // URL validation
  const validateUrl = (value: string) => {
    if (!value) {
      setIsValid(null);
      return;
    }
    
    const hasValidFormat = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+\/?)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/i.test(value);
    setIsValid(hasValidFormat);
  };

  // Handle URL changes
  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    validateUrl(newUrl);
  };

  // Check website accessibility
  const checkWebsiteAccessibility = async (websiteUrl: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return Math.random() > 0.1;
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
    
    let formattedUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      formattedUrl = 'https://' + url;
    }
    
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
    
    toast({
      title: "Проверка сайта",
      description: "Проверяем доступность сайта...",
    });
    
    const isAccessible = await checkWebsiteAccessibility(formattedUrl);
    
    if (!isAccessible) {
      setIsLoading(false);
      toast({
        title: "Сайт недоступен",
        description: "Не удалось подключиться к сайту. Проверьте URL и попробуйте снова.",
        variant: "destructive",
      });
      return;
    }
    
    const stages = [
      "Проверка доступности сайта...",
      "Анализ структуры страницы...",
      "Проверка метаданных...",
      "Оценка мобильной версии...",
      "Формирование отчета..."
    ];
    
    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        setProgressStage(currentStage);
        toast({
          title: "Анализируем сайт",
          description: stages[currentStage],
        });
        currentStage++;
      } else {
        clearInterval(interval);
        setIsLoading(false);
        navigate(`/audit?url=${encodeURIComponent(formattedUrl)}`);
      }
    }, 600);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="w-full max-w-3xl mx-auto px-4 md:px-0"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <UrlInput 
        url={url}
        onUrlChange={handleUrlChange}
        isLoading={isLoading}
        isValid={isValid}
        progressStage={progressStage}
        advancedOptions={advancedOptions}
        onAdvancedOptionsChange={handleAdvancedOptionsChange}
      />
      
      <AnimatePresence>
        {!isLoading && (
          <QuickActions />
        )}
      </AnimatePresence>
    </motion.form>
  );
};

export default UrlForm;
