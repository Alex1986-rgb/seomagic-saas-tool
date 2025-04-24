
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Feature } from './types';
import FeatureCard from './FeatureCard';

interface FeaturesListProps {
  features: Feature[];
  onFeatureUpdate: (id: string, field: string, value: string | boolean) => void;
  onFeatureRemove: (id: string) => void;
  onFeatureAdd: () => void;
}

const FeaturesList: React.FC<FeaturesListProps> = ({
  features,
  onFeatureUpdate,
  onFeatureRemove,
  onFeatureAdd
}) => {
  return (
    <Card className="bg-black/20 border-white/10">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Список возможностей</h3>
          <Button onClick={onFeatureAdd} className="bg-primary hover:bg-primary/90" size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Добавить возможность
          </Button>
        </div>
        
        <div className="space-y-4 mt-6">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              onUpdate={onFeatureUpdate}
              onRemove={onFeatureRemove}
            />
          ))}
          
          {features.length === 0 && (
            <div className="p-8 text-center border border-dashed border-white/10 rounded-md bg-black/10">
              <p className="text-gray-400">Возможности не найдены. Добавьте новую возможность.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturesList;
