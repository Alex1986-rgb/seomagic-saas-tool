
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Feature } from './types';
import FeatureCard from './FeatureCard';

interface SortableFeatureItemProps {
  feature: Feature;
  onUpdate: (id: string, field: string, value: string | boolean) => void;
  onRemove: (id: string) => void;
}

export const SortableFeatureItem: React.FC<SortableFeatureItemProps> = ({
  feature,
  onUpdate,
  onRemove
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: feature.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <FeatureCard
        feature={feature}
        onUpdate={onUpdate}
        onRemove={onRemove}
        dragHandleProps={listeners}
      />
    </div>
  );
};
