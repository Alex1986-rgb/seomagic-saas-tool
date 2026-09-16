
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FeatureSidebarProps {
  benefits: string[];
}

/**
 * Кнопка «Попробовать бесплатно» ничего не делала, а в «Характеристиках»
 * значились «мгновенная» скорость, «ежедневные» проверки, данные «в реальном
 * времени» и экспорт в PDF, HTML, CSV. Проверок по расписанию нет, выгрузка —
 * только PDF и JSON. Характеристики убраны, кнопка ведёт на аудит.
 */
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
          
          <Button className="w-full mt-8" asChild>
            <Link to="/audit">Проверить сайт</Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeatureSidebar;
