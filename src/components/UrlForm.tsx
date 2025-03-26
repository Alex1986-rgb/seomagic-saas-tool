
import React, { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from './ui/button';

const UrlForm: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to audit page with the URL as a parameter
      navigate(`/audit?url=${encodeURIComponent(formattedUrl)}`);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="neo-glass p-2 md:p-3 flex flex-col md:flex-row items-center gap-3 rounded-xl overflow-hidden">
        <div className="flex items-center w-full px-2 gap-2">
          <span className="text-primary">https://</span>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Введите URL сайта (например, example.com)"
            className="flex-grow bg-transparent px-2 py-3 focus:outline-none text-foreground placeholder:text-muted-foreground w-full"
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-colors w-full md:w-auto"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <span className="mr-2">Анализировать</span>
              <ArrowRight size={16} />
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default UrlForm;
