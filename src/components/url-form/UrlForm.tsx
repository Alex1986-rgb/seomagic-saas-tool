
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight } from 'lucide-react';

const UrlForm: React.FC = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState<string>('');
  const [isUrlValid, setIsUrlValid] = useState<boolean>(true);
  
  const validateUrl = (value: string): boolean => {
    if (!value.trim()) return false;
    
    // Simple URL validation (can be enhanced for more strict checking)
    const pattern = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    return pattern.test(value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = validateUrl(url);
    setIsUrlValid(isValid);
    
    if (isValid) {
      let formattedUrl = url;
      
      // Add https:// if the URL doesn't have a protocol
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = 'https://' + formattedUrl;
      }
      
      navigate(`/audit?url=${encodeURIComponent(formattedUrl)}`);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    
    // Reset validation state when user types
    if (!isUrlValid) {
      setIsUrlValid(true);
    }
  };
  
  console.log("UrlForm rendering");

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center">
        <div className="absolute left-3">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        
        <Input
          type="text"
          placeholder="Введите URL вашего сайта"
          value={url}
          onChange={handleInputChange}
          className={`pl-10 h-12 pr-24 text-base ${!isUrlValid ? 'border-destructive focus-visible:ring-destructive/30' : ''}`}
          aria-invalid={!isUrlValid}
        />
        
        <Button 
          type="submit" 
          className="absolute right-1 h-10"
          aria-label="Начать аудит"
        >
          Начать аудит <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      {!isUrlValid && (
        <p className="text-sm text-destructive mt-1">
          Пожалуйста, введите корректный URL сайта
        </p>
      )}
      
      <div className="text-xs text-muted-foreground mt-2">
        Например: example.com или https://example.com
      </div>
    </form>
  );
};

export default UrlForm;
