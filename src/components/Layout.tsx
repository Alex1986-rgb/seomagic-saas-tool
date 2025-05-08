
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './navbar';
import Footer from './Footer';
import StarryBackground from './backgrounds/StarryBackground';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';
import PerformanceMonitor from './shared/performance/PerformanceMonitor';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  hideNavbar?: boolean;
  hideFooter?: boolean;
  animateTransitions?: boolean;
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: 'easeInOut' }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3, ease: 'easeInOut' }
  }
};

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  className,
  hideNavbar = false,
  hideFooter = false,
  animateTransitions = true
}) => {
  const location = useLocation();
  const [isFirstRender, setIsFirstRender] = useState(true);
  
  // Проверяем, начинается ли текущий путь с /admin
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // На административных страницах мы скрываем стандартную навигацию и подвал,
  // так как у них есть своя встроенная навигация
  const shouldHideNavbar = hideNavbar || isAdminRoute;
  const shouldHideFooter = hideFooter || isAdminRoute;

  // После первого рендера разрешаем анимацию
  useEffect(() => {
    // Небольшая задержка чтобы не блокировать первый рендер
    const timeout = setTimeout(() => {
      setIsFirstRender(false);
    }, 10);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={cn("flex flex-col min-h-screen relative", className)}>
      <div className="fixed inset-0 z-[-1]">
        <StarryBackground />
      </div>
      
      {!shouldHideNavbar && <Navbar />}
      
      <AnimatePresence mode="wait">
        <motion.main 
          key={location.pathname}
          className="flex-grow relative z-10 w-full"
          initial={animateTransitions && !isFirstRender ? 'initial' : false}
          animate={animateTransitions ? 'animate' : false}
          exit={animateTransitions ? 'exit' : false}
          variants={pageVariants}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      
      {!shouldHideFooter && <Footer />}
      
      {/* Мониторинг производительности в режиме разработки */}
      {process.env.NODE_ENV === 'development' && (
        <PerformanceMonitor showDebugInfo />
      )}
    </div>
  );
};

export default Layout;
