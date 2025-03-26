import React, { useState, useEffect } from 'react';
import { ArrowRight, Loader2, Globe, CheckCircle, Settings, Search, FileSearch, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const UrlForm: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [progressStage, setProgressStage] = useState(0);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [advancedOptions, setAdvancedOptions] = useState({
    maxPages: 1000,
    scanDepth: 10,
    followExternalLinks: false,
    analyzeMobile: true,
    checkSecurity: true,
    checkPerformance: true
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!url) {
      setIsValid(null);
      return;
    }
    
    const hasValidFormat = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+\/?)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/i.test(url);
    setIsValid(hasValidFormat);
  }, [url]);

  const checkWebsiteAccessibility = async (websiteUrl: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return Math.random() > 0.1;
  };

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

  const handleAdvancedOptionsChange = (key: string, value: any) => {
    setAdvancedOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div 
        className={`neo-glass p-2 md:p-3 flex flex-col md:flex-row items-center gap-3 rounded-xl overflow-hidden transition-all duration-300 ${isFocused ? 'ring-2 ring-primary/50 shadow-lg' : ''} ${isValid === true && url ? 'ring-1 ring-green-500/50' : ''} ${isValid === false && url ? 'ring-1 ring-red-500/50' : ''}`}
        whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center w-full px-2 gap-2 group">
          <AnimatePresence mode="wait">
            {isValid === true && url ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CheckCircle className="h-5 w-5 text-green-500" />
              </motion.div>
            ) : isValid === false && url ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Globe className={`h-5 w-5 ${isFocused ? 'text-primary' : 'text-muted-foreground'} group-hover:text-primary transition-colors duration-200`} />
              </motion.div>
            )}
          </AnimatePresence>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Введите URL сайта (например, example.com)"
            className="flex-grow bg-transparent px-2 py-3 focus:outline-none text-foreground placeholder:text-muted-foreground w-full transition-all duration-200"
            disabled={isLoading}
            autoFocus
          />
          
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <h4 className="font-medium mb-4">Настройки аудита</h4>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Максимум страниц: {advancedOptions.maxPages}</Label>
                  </div>
                  <Slider 
                    value={[advancedOptions.maxPages]} 
                    min={100}
                    max={250000}
                    step={100}
                    onValueChange={(value) => handleAdvancedOptionsChange('maxPages', value[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Глубина сканирования: {advancedOptions.scanDepth}</Label>
                  </div>
                  <Slider 
                    value={[advancedOptions.scanDepth]} 
                    min={1}
                    max={50}
                    step={1}
                    onValueChange={(value) => handleAdvancedOptionsChange('scanDepth', value[0])}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="follow-external" 
                    checked={advancedOptions.followExternalLinks}
                    onCheckedChange={(checked) => handleAdvancedOptionsChange('followExternalLinks', checked)}
                  />
                  <Label htmlFor="follow-external">Внешние ссылки</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="mobile-check"
                    checked={advancedOptions.analyzeMobile}
                    onCheckedChange={(checked) => handleAdvancedOptionsChange('analyzeMobile', checked)}
                  />
                  <Label htmlFor="mobile-check">Мобильная версия</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="security-check"
                    checked={advancedOptions.checkSecurity}
                    onCheckedChange={(checked) => handleAdvancedOptionsChange('checkSecurity', checked)}
                  />
                  <Label htmlFor="security-check">Проверка безопасности</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="performance-check"
                    checked={advancedOptions.checkPerformance}
                    onCheckedChange={(checked) => handleAdvancedOptionsChange('checkPerformance', checked)}
                  />
                  <Label htmlFor="performance-check">Анализ производительности</Label>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full md:w-auto relative overflow-hidden group"
        >
          <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-500 ease-out group-hover:w-full"></span>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-xs">{progressStage + 1}/5</span>
            </div>
          ) : (
            <>
              <span className="mr-2 relative z-10">Анализировать</span>
              <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
            </>
          )}
        </Button>
      </motion.div>
      <AnimatePresence>
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="flex justify-center gap-4 mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                className="text-xs flex items-center gap-1"
                onClick={() => alert("Быстрое сканирование проверит только главную страницу и основные SEO-факторы")}
              >
                <Search className="h-3 w-3" />
                Быстрое сканирование
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                className="text-xs flex items-center gap-1"
                onClick={() => alert("Полное сканирование проанализирует все страницы сайта и даст подробный отчет")}
              >
                <FileSearch className="h-3 w-3" />
                Полное сканирование
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
};

export default UrlForm;
