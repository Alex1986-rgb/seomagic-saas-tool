
import { useState } from 'react';

/**
 * Hook for toggling content optimization prompt visibility
 */
export const usePromptToggle = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  
  const togglePrompt = () => {
    setShowPrompt(prevState => !prevState);
  };

  return {
    showPrompt,
    togglePrompt
  };
};
