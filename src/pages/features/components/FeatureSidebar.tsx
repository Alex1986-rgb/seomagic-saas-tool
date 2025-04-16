
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FeatureSidebarProps {
  benefits: string[];
}

const FeatureSidebar = ({ benefits }: FeatureSidebarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Преимущества</h3>
          <ul className="space-y-3">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <Check size={16} className="mt-1 mr-2 text-primary" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
          
          <Button className="w-full mt-8">Попробовать бесплатно</Button>
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4">Характеристики</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Скорость работы</span>
              <span className="font-medium">Мгновенно</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Частота проверок</span>
              <span className="font-medium">Ежедневно</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Доступ к данным</span>
              <span className="font-medium">В реальном времени</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Экспорт отчетов</span>
              <span className="font-medium">PDF, HTML, CSV</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeatureSidebar;
