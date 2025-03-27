
import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOffline, setShowOffline] = useState(false);
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setTimeout(() => setShowOffline(false), 3000);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setShowOffline(true);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return (
    <AnimatePresence>
      {!isOnline && showOffline && (
        <motion.div 
          className="fixed bottom-4 left-4 bg-destructive text-white p-3 rounded-lg flex items-center shadow-lg z-50"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          <WifiOff className="h-5 w-5 mr-2" />
          <span>Отсутствует подключение к интернету</span>
        </motion.div>
      )}
      {isOnline && showOffline && (
        <motion.div 
          className="fixed bottom-4 left-4 bg-green-500 text-white p-3 rounded-lg flex items-center shadow-lg z-50"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          <Wifi className="h-5 w-5 mr-2" />
          <span>Подключение восстановлено</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NetworkStatus;
