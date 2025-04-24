
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, ArrowUpDown } from 'lucide-react';
import { Feature } from './types';
import FeatureCard from './FeatureCard';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableFeatureItem } from './SortableFeatureItem';

interface FeaturesListProps {
  features: Feature[];
  onFeatureUpdate: (id: string, field: string, value: string | boolean) => void;
  onFeatureRemove: (id: string) => void;
  onFeatureAdd: () => void;
  onFeaturesReorder: (features: Feature[]) => void;
}

const FeaturesList: React.FC<FeaturesListProps> = ({
  features,
  onFeatureUpdate,
  onFeatureRemove,
  onFeatureAdd,
  onFeaturesReorder
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredFeatures = features
    .filter(feature => 
      feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.order - b.order;
      }
      return b.order - a.order;
    });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = features.findIndex((item) => item.id === active.id);
      const newIndex = features.findIndex((item) => item.id === over.id);
      
      // Create new array with reordered items
      const newFeatures = [...features];
      const movedItem = newFeatures.splice(oldIndex, 1)[0];
      newFeatures.splice(newIndex, 0, movedItem);
      
      // Update order property for each feature
      const updatedFeatures = newFeatures.map((feature, index) => ({
        ...feature,
        order: index + 1
      }));
      
      onFeaturesReorder(updatedFeatures);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

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

        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск возможностей..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-black/20 border-white/10"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSortOrder}
            className="border-white/10"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4 mt-6">
          <DndContext 
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            {filteredFeatures.map((feature) => (
              <SortableFeatureItem
                key={feature.id}
                feature={feature}
                onUpdate={onFeatureUpdate}
                onRemove={onFeatureRemove}
              />
            ))}
          </DndContext>
          
          {features.length === 0 && (
            <div className="p-8 text-center border border-dashed border-white/10 rounded-md bg-black/10">
              <p className="text-gray-400">Возможности не найдены. Добавьте новую возможность.</p>
            </div>
          )}

          {features.length > 0 && filteredFeatures.length === 0 && (
            <div className="p-8 text-center border border-dashed border-white/10 rounded-md bg-black/10">
              <p className="text-gray-400">Ничего не найдено по вашему запросу.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturesList;
