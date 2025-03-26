
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, Globe, CheckCircle, Settings, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdvancedOptions from './AdvancedOptions';

interface UrlInputProps {
  url: string;
  onUrlChange: (url: string) => void;
  isLoading: boolean;
  isValid: boolean | null;
  progressStage: number;
  advancedOptions: {
    maxPages: number;
    scanDepth: number;
    followExternalLinks: boolean;
    analyzeMobile: boolean;
    checkSecurity: boolean;
    checkPerformance: boolean;
  };
  onAdvancedOptionsChange: (key: string, value: any) => void;
}

const UrlInput: React.FC<UrlInputProps> = ({
  url,
  onUrlChange,
  isLoading,
  isValid,
  progressStage,
  advancedOptions,
  onAdvancedOptionsChange
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
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
          onChange={(e) => onUrlChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Введите URL сайта (например, example.com)"
          className="flex-grow bg-transparent px-2 py-3 focus:outline-none text-foreground placeholder:text-muted-foreground w-full transition-all duration-200"
          disabled={isLoading}
          autoFocus
        />
        
        <AdvancedOptions 
          options={advancedOptions}
          onOptionsChange={onAdvancedOptionsChange}
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
  );
};

export default UrlInput;
