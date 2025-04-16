
import React from 'react';
import { motion } from 'framer-motion';
import PromptSelector from './optimize/PromptSelector';
import OptimizeActions from './optimize/OptimizeActions';

interface OptimizeTabProps {
  seoPrompt: string;
  selectedPromptTemplate: string;
  promptTemplates: Array<{
    id: string;
    name: string;
    prompt: string;
  }>;
  isOptimizing: boolean;
  isCompleted: boolean;
  onSeoPromptChange: (prompt: string) => void;
  onPromptTemplateChange: (value: string) => void;
  onOptimize: () => void;
  onDownloadOptimized: () => void;
}

const OptimizeTab: React.FC<OptimizeTabProps> = ({
  seoPrompt,
  selectedPromptTemplate,
  promptTemplates,
  isOptimizing,
  isCompleted,
  onSeoPromptChange,
  onPromptTemplateChange,
  onOptimize,
  onDownloadOptimized
}) => {
  return (
    <motion.div
      className="mt-4 space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <PromptSelector 
        seoPrompt={seoPrompt}
        selectedPromptTemplate={selectedPromptTemplate}
        promptTemplates={promptTemplates}
        onSeoPromptChange={onSeoPromptChange}
        onPromptTemplateChange={onPromptTemplateChange}
      />
      
      <OptimizeActions 
        seoPrompt={seoPrompt}
        isOptimizing={isOptimizing}
        isCompleted={isCompleted}
        onOptimize={onOptimize}
        onDownloadOptimized={onDownloadOptimized}
      />
    </motion.div>
  );
};

export default OptimizeTab;
