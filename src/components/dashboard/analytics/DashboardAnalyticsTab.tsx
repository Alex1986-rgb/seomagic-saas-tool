
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BarChart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const DashboardAnalyticsTab: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 overflow-hidden">
      <CardHeader className="pb-2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-primary" />
            Аналитика
          </CardTitle>
          <CardDescription>
            Детальная аналитика ваших проектов
          </CardDescription>
        </motion.div>
      </CardHeader>
      <CardContent className="h-[400px] flex items-center justify-center">
        <motion.div 
          className="text-center max-w-md p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Users className="h-10 w-10 text-primary/80" />
          </div>
          <h3 className="text-xl font-medium mb-3">Нет доступных данных</h3>
          <p className="text-muted-foreground mb-6">
            Запустите аудит сайта для получения детальной аналитики и отслеживания прогресса
          </p>
          <Button 
            className="px-6 gap-2 shadow-md hover:shadow-lg" 
            onClick={() => navigate('/audit')}
          >
            Запустить аудит
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default DashboardAnalyticsTab;
