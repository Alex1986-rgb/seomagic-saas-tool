
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
      className={`glass-panel p-2 md:p-3 flex flex-col md:flex-row items-center gap-2 md:gap-3 overflow-hidden transition-all duration-300 ${isFocused ? 'ring-2 ring-primary/50 shadow-lg shadow-primary/10' : ''} ${isValid === true && url ? 'ring-1 ring-green-500/50' : ''} ${isValid === false && url ? 'ring-1 ring-red-500/50' : ''}`}
      whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center w-full px-1 md:px-2 gap-1 md:gap-2 group">
        <AnimatePresence mode="wait">
          {isValid === true && url ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
            </motion.div>
          ) : isValid === false && url ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Globe className={`h-4 w-4 md:h-5 md:w-5 ${isFocused ? 'text-primary' : 'text-muted-foreground'} group-hover:text-primary transition-colors duration-200`} />
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
          className="flex-grow bg-transparent px-1 md:px-2 py-2 md:py-3 focus:outline-none text-foreground placeholder:text-muted-foreground w-full transition-all duration-200 text-sm md:text-base"
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
        variant="glassmorphic"
        className="w-full md:w-auto relative overflow-hidden group text-sm md:text-base py-1.5 md:py-2"
      >
        <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-500 ease-out group-hover:w-full"></span>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
            <span className="text-xs md:text-sm">{progressStage + 1}/5</span>
          </div>
        ) : (
          <>
            <span className="mr-1 md:mr-2 relative z-10">Анализировать</span>
            <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
          </>
        )}
      </Button>
    </motion.div>
  );
};

export default UrlInput;
