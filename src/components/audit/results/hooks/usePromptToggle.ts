
import { useState, useCallback } from 'react';

export function usePromptToggle() {
  const [showPrompt, setShowPrompt] = useState(false);
  
  const togglePrompt = useCallback(() => {
    setShowPrompt(prevState => !prevState);
  }, []);

  return {
    showPrompt,
    togglePrompt
  };
}
