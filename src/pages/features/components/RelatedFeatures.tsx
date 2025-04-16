
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FeatureData } from '@/components/features/types';

interface RelatedFeaturesProps {
  features: FeatureData[];
}

const RelatedFeatures = ({ features }: RelatedFeaturesProps) => {
  if (features.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h2 className="text-2xl font-semibold mb-6">Похожие функции</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const FeatureIcon = feature.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    <FeatureIcon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium">{feature.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {feature.description}
                </p>
                <Link to={feature.link || `/features/${feature.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  <Button variant="link" className="p-0 h-auto text-primary">
                    Подробнее
                    <ChevronRight size={14} className="ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RelatedFeatures;
