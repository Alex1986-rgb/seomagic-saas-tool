
import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileSearch, Home, ShieldCheck } from 'lucide-react';
import Layout from '@/components/Layout';

const NotFound: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Check if this is an admin route that's not found
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  const handleGoBack = () => navigate(-1);
  const handleGoHome = () => navigate('/');
  const handleGoAdmin = () => navigate('/admin');

  return (
    <Layout>
      <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[80vh] text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md"
        >
          <div className="mb-8 relative">
            <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <FileSearch className="h-16 w-16 text-primary/70" />
            </div>
            <div className="absolute -top-3 -right-3 bg-red-500 text-white text-3xl font-bold h-12 w-12 rounded-full flex items-center justify-center">
              404
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Страница не найдена</h1>
          
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            Кажется, страница, которую вы ищете, не существует или была перемещена. Проверьте URL или вернитесь на главную.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleGoBack}
              variant="outline"
              className="flex items-center gap-2"
            >
              <span>Вернуться назад</span>
            </Button>
            
            {isAdminRoute ? (
              <Button 
                onClick={handleGoAdmin} 
                className="flex items-center gap-2"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Панель администратора</span>
              </Button>
            ) : (
              <Button 
                onClick={handleGoHome} 
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                <span>На главную</span>
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default NotFound;
