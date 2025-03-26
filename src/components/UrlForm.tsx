
import React, { useState, useEffect } from 'react';
import { ArrowRight, Loader2, Globe, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const UrlForm: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [progressStage, setProgressStage] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Validate URL as user types
  useEffect(() => {
    if (!url) {
      setIsValid(null);
      return;
    }
    
    // Simple check while typing
    const hasValidFormat = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+\/?)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/i.test(url);
    setIsValid(hasValidFormat);
  }, [url]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate URL
    if (!url) {
      toast({
        title: "URL обязателен",
        description: "Пожалуйста, введите корректный URL сайта",
        variant: "destructive",
      });
      return;
    }
    
    // Add http:// prefix if missing
    let formattedUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      formattedUrl = 'https://' + url;
    }
    
    try {
      // Validate URL format
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
    
    // Display animated progress stages
    toast({
      title: "Анализируем сайт",
      description: "Подключаемся к серверу...",
    });
    
    // Simulated multi-stage progress
    const stages = [
      "Проверка доступности сайта...",
      "Анализ структуры страницы...",
      "Проверка метаданных...",
      "Оценка мобильной версии...",
      "Формирование отчета..."
    ];
    
    // Progress animation simulation
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
        // Navigate to audit page with the URL as a parameter
        navigate(`/audit?url=${encodeURIComponent(formattedUrl)}`);
      }
    }, 400);
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
            <motion.p 
              className="text-xs text-muted-foreground text-center mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              Мы проанализируем ваш сайт и предоставим подробные рекомендации
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
};

export default UrlForm;
