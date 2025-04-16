
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUrlForm } from '@/hooks/use-url-form';
import UrlInput from './UrlInput';
import QuickActions from './QuickActions';

const UrlForm: React.FC = () => {
  const {
    url,
    isLoading,
    isValid,
    progressStage,
    advancedOptions,
    handleUrlChange,
    handleAdvancedOptionsChange,
    handleSubmit
  } = useUrlForm();

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
