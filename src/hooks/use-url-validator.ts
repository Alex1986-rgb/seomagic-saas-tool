
import { useState } from 'react';

export const useUrlValidator = () => {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validateUrl = (value: string) => {
    if (!value) {
      setIsValid(null);
      return;
    }
    
    const hasValidFormat = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+\/?)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/i.test(value);
    setIsValid(hasValidFormat);
    return hasValidFormat;
  };

  const formatUrl = (url: string): string => {
    let formattedUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      formattedUrl = 'https://' + url;
    }
    return formattedUrl;
  };

  return {
    isValid,
    validateUrl,
    formatUrl
  };
};

export default useUrlValidator;
