import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Globe, Zap } from 'lucide-react';

const UrlForm: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    
    // Here would be actual audit logic
    console.log('Starting audit for:', url);
  };

  return (
    <motion.div 
      className="w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="neo-card p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="url"
                placeholder="Введите URL вашего сайта (например: https://example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-10 h-12 text-base bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary transition-all duration-300"
                required
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading || !url.trim()}
              className="h-12 px-8 bg-gradient-primary hover:shadow-glow transition-all duration-300 group"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Анализ...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Начать аудит
                </>
              )}
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span>Быстрый анализ</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-success rounded-full animate-pulse" />
              <span>Бесплатно</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
              <span>Подробный отчет</span>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default UrlForm;